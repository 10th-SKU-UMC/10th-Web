import axios, { type InternalAxiosRequestConfig } from "axios";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import { postRefreshToken } from "./auth";

interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

const getTokenFromStorage = (key: string) => {
  try {
    const token = localStorage.getItem(key);
    return token ? JSON.parse(token) : null;
  } catch (error) {
    console.error("Failed to parse token from localStorage:", error);
    localStorage.removeItem(key);
    return null;
  }
};

const setTokenToStorage = (key: string, value: string) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const removeTokensFromStorage = () => {
  localStorage.removeItem(LOCAL_STORAGE_KEY.accessToken);
  localStorage.removeItem(LOCAL_STORAGE_KEY.refreshToken);
};

// 동시 401 발생 시 refresh 요청이 중복 발행되지 않도록 단일 비행(single-flight) 관리
let refreshTokenPromise: Promise<string> | null = null;

axiosInstance.interceptors.request.use((config) => {
  const accessToken = getTokenFromStorage(LOCAL_STORAGE_KEY.accessToken);

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as CustomInternalAxiosRequestConfig;
    const requestUrl = originalRequest?.url ?? "";

    if (requestUrl.includes("/v1/auth/refresh")) {
      removeTokensFromStorage();
      window.location.href = "/login";
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // refreshToken null 체크는 Promise 생성 전 각 요청에서 수행
      const refreshToken = getTokenFromStorage(LOCAL_STORAGE_KEY.refreshToken);
      if (!refreshToken) {
        removeTokensFromStorage();
        window.location.href = "/login";
        return Promise.reject(error);
      }

      // 이미 진행 중인 refresh가 없을 때만 새 요청 발행 → 나머지는 동일 Promise 공유
      if (!refreshTokenPromise) {
        refreshTokenPromise = postRefreshToken({ refresh: refreshToken })
          .then((response) => {
            const newAccessToken = response.data.accessToken;
            const newRefreshToken = response.data.refreshToken;
            setTokenToStorage(LOCAL_STORAGE_KEY.accessToken, newAccessToken);
            setTokenToStorage(LOCAL_STORAGE_KEY.refreshToken, newRefreshToken);
            return newAccessToken;
          })
          .catch((err) => {
            removeTokensFromStorage();
            window.location.href = "/login";
            throw err;
          })
          .finally(() => {
            refreshTokenPromise = null;
          });
      }

      const newAccessToken = await refreshTokenPromise;
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return axiosInstance(originalRequest);
    }

    return Promise.reject(error);
  },
);