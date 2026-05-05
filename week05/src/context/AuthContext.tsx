/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, type PropsWithChildren } from "react";
import type { RequestSigninDto } from "../types/auth";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import { postLogout, postSignin } from "../api/auth";

interface AuthContextType {
  accessToken: string | null;
  refreshToken: string | null;
  login: (signInData: RequestSigninDto) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  accessToken: null,
  refreshToken: null,
  login: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [accessToken, setAccessToken] = useLocalStorage<string | null>(
    LOCAL_STORAGE_KEY.accessToken,
    null,
  );
  const [refreshToken, setRefreshToken] = useLocalStorage<string | null>(
    LOCAL_STORAGE_KEY.refreshToken,
    null,
  );

  const login = async (signInData: RequestSigninDto) => {
    try {
      const { data } = await postSignin(signInData);
      setAccessToken(data.accessToken);
      setRefreshToken(data.refreshToken ?? null);
      alert("로그인 성공");
    } catch (error) {
      console.error("로그인 오류:", error);
      alert("로그인 실패");
      throw error;
    }
  };

  const logout = async () => {
    try {
      if (accessToken) await postLogout(accessToken);
    } catch (error) {
      console.error("로그아웃 오류", error);
    } finally {
      setAccessToken(null);
      setRefreshToken(null);
      alert("로그아웃 완료");
    }
  };

  return (
    <AuthContext.Provider value={{ accessToken, refreshToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
