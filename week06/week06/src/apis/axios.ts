import axios, { type InternalAxiosRequestConfig } from "axios";
import { LOCAL_STORAGE_KEY } from "../constants/key";

interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// 전역 변수로 refresh 요청의 Promise를 저장해서 중복 요청을 방지한다.
let refreshPromise: Promise<string> | null = null;

// 인터셉터는 React 컴포넌트가 아니므로 hook 대신 직접 localStorage를 사용한다.
const getStorageItem = (key: string): string | null => {
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch {
    return null;
  }
};

const setStorageItem = (key: string, value: unknown): void => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch { /* ignore */ }
};

const removeStorageItem = (key: string): void => {
  try {
    window.localStorage.removeItem(key);
  } catch { /* ignore */ }
};

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_API_URL,
  withCredentials: true,
});

// 요청 인터셉터: 모든 요청 전에 accessToken을 Authorization 헤더에 추가한다.
axiosInstance.interceptors.request.use(
  (config) => {
    // refresh 엔드포인트는 만료된 토큰을 보내면 백엔드가 거부하므로 헤더를 붙이지 않는다.
    if (config.url === "/v1/auth/refresh") {
      return config;
    }

    const accessToken = getStorageItem(LOCAL_STORAGE_KEY.accessToken);

    if (accessToken) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// 응답 인터셉터: 401 에러 발생 -> refresh 토큰을 통한 토큰 갱신을 처리합니다.
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest: CustomInternalAxiosRequestConfig = error.config;

    // 401 에러이면서, 아직 재시도하지 않은 요청의 경우 처리
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      // refresh 엔드포인트 401 에러: 중복 재시도 방지를 위해 로그아웃 처리
      if (originalRequest.url === "/v1/auth/refresh") {
        removeStorageItem(LOCAL_STORAGE_KEY.accessToken);
        removeStorageItem(LOCAL_STORAGE_KEY.refreshToken);
        window.location.href = "/login";
        return Promise.reject(error);
      }

      // 재시도 플래그 설정
      originalRequest._retry = true;

      // 이미 리프레시 요청이 진행중이면, 그 Promise를 재사용합니다.
      if (!refreshPromise) {
        refreshPromise = (async () => {
          const refreshToken = getStorageItem(LOCAL_STORAGE_KEY.refreshToken);
          const { data } = await axiosInstance.post("/v1/auth/refresh", {
            refresh: refreshToken,
          });

          setStorageItem(LOCAL_STORAGE_KEY.accessToken, data.data.accessToken);
          setStorageItem(LOCAL_STORAGE_KEY.refreshToken, data.data.refreshToken);

          return data.data.accessToken as string;
        })()
          .catch((err) => {
            removeStorageItem(LOCAL_STORAGE_KEY.accessToken);
            removeStorageItem(LOCAL_STORAGE_KEY.refreshToken);
            throw err;
          })
          .finally(() => {
            refreshPromise = null;
          });
      }

      return refreshPromise.then((newAccessToken) => {
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return axiosInstance.request(originalRequest);
      });
    }

    return Promise.reject(error);
  },
);
