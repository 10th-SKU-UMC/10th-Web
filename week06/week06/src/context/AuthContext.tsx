import type { RequestSigninDto } from "../types/auth.ts";
import {
  createContext,
  useState,
  useContext,
  useEffect,
  type PropsWithChildren,
} from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import { postSignin, postLogout, postRefresh } from "../apis/auth";

interface AuthContextType {
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  login: (signInData: RequestSigninDto) => Promise<void>;
  logout: () => Promise<void>;
  setAuthTokens: (accessToken: string, refreshToken: string) => void;
}

export const AuthContext = createContext<AuthContextType>({
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isAuthLoading: true,
  login: async () => {},
  logout: async () => {},
  setAuthTokens: () => {},
});

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const {
    getItem: getAccessTokenFromStorage,
    setItem: setAccessTokenInStorage,
    removeItem: removeAccessTokenFromStorage,
  } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);

  const {
    getItem: getRefreshTokenFromStorage,
    setItem: setRefreshTokenInStorage,
    removeItem: removeRefreshTokenFromStorage,
  } = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);

  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // 앱 시작 시 refreshToken으로 인증 상태 확인
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedRefreshToken = getRefreshTokenFromStorage();

        if (!storedRefreshToken) {
          setIsAuthenticated(false);
          return;
        }

        const { data } = await postRefresh({ refresh: storedRefreshToken });

        setAccessTokenInStorage(data.accessToken);
        setRefreshTokenInStorage(data.refreshToken);

        setAccessToken(data.accessToken);
        setRefreshToken(data.refreshToken);
        setIsAuthenticated(true);
      } catch {
        removeAccessTokenFromStorage();
        removeRefreshTokenFromStorage();
        setAccessToken(null);
        setRefreshToken(null);
        setIsAuthenticated(false);
      } finally {
        setIsAuthLoading(false);
      }
    };

    initializeAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setAuthTokens = (newAccessToken: string, newRefreshToken: string) => {
    setAccessTokenInStorage(newAccessToken);
    setRefreshTokenInStorage(newRefreshToken);
    setAccessToken(newAccessToken);
    setRefreshToken(newRefreshToken);
    setIsAuthenticated(true);
  };

  const login = async (signinData: RequestSigninDto) => {
    try {
      const { data } = await postSignin(signinData);

      if (data) {
        setAuthTokens(data.accessToken, data.refreshToken);
        alert("로그인 성공");
      }
    } catch (error) {
      console.error("로그인 오류", error);
      alert("로그인 실패");
    }
  };

  const logout = async () => {
    try {
      await postLogout();
    } catch (error) {
      console.error("로그아웃 오류", error);
    } finally {
      removeAccessTokenFromStorage();
      removeRefreshTokenFromStorage();
      setAccessToken(null);
      setRefreshToken(null);
      setIsAuthenticated(false);
      alert("로그아웃 성공");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        refreshToken,
        isAuthenticated,
        isAuthLoading,
        login,
        logout,
        setAuthTokens,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("AuthContext를 찾을 수 없습니다.");
  }

  return context;
};
