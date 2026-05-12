import axios, {
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import {
  getStorageItem,
  removeStorageItem,
  setStorageItem,
} from "../hooks/useLocalStorage";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import type { ResponseRefreshDto } from "../types/auth";

interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

let refreshPromise: Promise<string> | null = null;

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = getStorageItem<string>(LOCAL_STORAGE_KEY.accessToken);

    if (accessToken) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

const requestNewAccessToken = async (): Promise<string> => {
  const refreshToken = getStorageItem<string>(LOCAL_STORAGE_KEY.refreshToken);

  if (!refreshToken) {
    throw new Error("No refresh token");
  }

  const { data } = await axios.post<ResponseRefreshDto>(
    `${import.meta.env.VITE_API_BASE_URL}/v1/auth/refresh`,
    { refresh: refreshToken },
  );

  setStorageItem(LOCAL_STORAGE_KEY.accessToken, data.data.accessToken);
  setStorageItem(LOCAL_STORAGE_KEY.refreshToken, data.data.refreshToken);

  return data.data.accessToken;
};

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest: CustomInternalAxiosRequestConfig | undefined =
      error.config;

    if (
      !originalRequest ||
      error.response?.status !== 401 ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (!refreshPromise) {
      refreshPromise = requestNewAccessToken().finally(() => {
        refreshPromise = null;
      });
    }

    try {
      const newAccessToken = await refreshPromise;
      originalRequest.headers = originalRequest.headers ?? {};
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return axiosInstance.request(originalRequest);
    } catch (refreshError) {
      removeStorageItem(LOCAL_STORAGE_KEY.accessToken);
      removeStorageItem(LOCAL_STORAGE_KEY.refreshToken);
      window.location.href = "/login";
      return Promise.reject(refreshError);
    }
  },
);
