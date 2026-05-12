import { createContext, useState, type ReactNode } from "react";
import { postLogout, postSignin } from "../apis/auth";
import type { RequestSigninDto } from "../apis/dto";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import { useLocalStorage } from "../hooks/useLocalStorage";

export type AuthContextType = {
  accessToken: string | null;
  refreshToken: string | null;
  name: string | null;
  userId: number | null;
  login: (signinData: RequestSigninDto) => Promise<void>;
  loginWithTokens: (accessToken: string, refreshToken: string, name?: string, userId?: number) => void;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { setItem: setAccessTokenToStorage, getItem: getAccessTokenFromStorage, removeItem: removeAccessTokenFromStorage } =
    useLocalStorage(LOCAL_STORAGE_KEY.accessToken);

  const { setItem: setRefreshTokenToStorage, getItem: getRefreshTokenFromStorage, removeItem: removeRefreshTokenFromStorage } =
    useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);

  const { setItem: setNameToStorage, getItem: getNameFromStorage, removeItem: removeNameFromStorage } =
    useLocalStorage(LOCAL_STORAGE_KEY.name);

  const { setItem: setUserIdToStorage, getItem: getUserIdFromStorage, removeItem: removeUserIdFromStorage } =
    useLocalStorage(LOCAL_STORAGE_KEY.userId);

  const [accessToken, setAccessToken] = useState<string | null>(getAccessTokenFromStorage());
  const [refreshToken, setRefreshToken] = useState<string | null>(getRefreshTokenFromStorage());
  const [name, setName] = useState<string | null>(getNameFromStorage());
  const [userId, setUserId] = useState<number | null>(() => {
    const stored = getUserIdFromStorage();
    return stored ? Number(stored) : null;
  });

  const login = async (signinData: RequestSigninDto) => {
    try {
      const response = await postSignin(signinData);

      const newAccessToken = response.data.accessToken;
      const newRefreshToken = response.data.refreshToken;
      const newName = response.data.name;
      const newUserId = response.data.id;

      setAccessTokenToStorage(newAccessToken);
      setRefreshTokenToStorage(newRefreshToken);
      setNameToStorage(newName);
      setUserIdToStorage(String(newUserId));

      setAccessToken(newAccessToken);
      setRefreshToken(newRefreshToken);
      setName(newName);
      setUserId(newUserId);

      alert("로그인에 성공했습니다.");
    } catch (error) {
      console.error("로그인 중 오류가 발생했습니다:", error);
      alert("로그인 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  const loginWithTokens = (newAccessToken: string, newRefreshToken: string, newName?: string, newUserId?: number) => {
    setAccessTokenToStorage(newAccessToken);
    setRefreshTokenToStorage(newRefreshToken);
    if (newName) setNameToStorage(newName);
    if (newUserId) setUserIdToStorage(String(newUserId));

    setAccessToken(newAccessToken);
    setRefreshToken(newRefreshToken);
    if (newName) setName(newName);
    if (newUserId) setUserId(newUserId);
  };

  const logout = async () => {
    try {
      await postLogout();
    } catch (error) {
      console.error("로그아웃 API 요청 중 오류가 발생했습니다:", error);
    } finally {
      removeAccessTokenFromStorage();
      removeRefreshTokenFromStorage();
      removeNameFromStorage();
      removeUserIdFromStorage();

      setAccessToken(null);
      setRefreshToken(null);
      setName(null);
      setUserId(null);

      alert("로그아웃 되었습니다.");
    }
  };

  return (
    <AuthContext.Provider value={{ accessToken, refreshToken, name, userId, login, loginWithTokens, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
