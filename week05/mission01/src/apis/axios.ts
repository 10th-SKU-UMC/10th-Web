import axios, { type InternalAxiosRequestConfig } from "axios";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import { postRefreshToken } from "./auth";

interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export const axiosInstance = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

const getTokenFromStorage = (key: string) => {
  const token = localStorage.getItem(key);
  return token ? JSON.parse(token) : null;
};

const setTokenToStorage = (key: string, value: string) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const removeTokensFromStorage = () => {
  localStorage.removeItem(LOCAL_STORAGE_KEY.accessToken);
  localStorage.removeItem(LOCAL_STORAGE_KEY.refreshToken);
};

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

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = getTokenFromStorage(LOCAL_STORAGE_KEY.refreshToken);

        if (!refreshToken) {
          removeTokensFromStorage();
          window.location.href = "/login";
          return Promise.reject(error);
        }

        const response = await postRefreshToken({
          refresh: refreshToken,
        });

        const newAccessToken = response.data.accessToken;
        const newRefreshToken = response.data.refreshToken;

        setTokenToStorage(LOCAL_STORAGE_KEY.accessToken, newAccessToken);
        setTokenToStorage(LOCAL_STORAGE_KEY.refreshToken, newRefreshToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        removeTokensFromStorage();
        window.location.href = "/login";

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);