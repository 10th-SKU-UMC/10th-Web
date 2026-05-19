import {
  createContext,
  useState,
  useContext,
  useEffect,
  type PropsWithChildren,
} from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import { postLogout, postRefresh } from "../apis/auth";

interface AuthContextType {
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  logout: () => Promise<void>;
  clearAuth: () => void;
  setAuthTokens: (accessToken: string, refreshToken: string) => void;
}

export const AuthContext = createContext<AuthContextType>({
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isAuthLoading: true,
  logout: async () => {},
  clearAuth: () => {},
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

  const clearAuth = () => {
    removeAccessTokenFromStorage();
    removeRefreshTokenFromStorage();
    setAccessToken(null);
    setRefreshToken(null);
    setIsAuthenticated(false);
  };

  const logout = async () => {
    try {
      await postLogout();
    } catch (error) {
      console.error("로그아웃 오류", error);
    } finally {
      clearAuth();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        refreshToken,
        isAuthenticated,
        isAuthLoading,
        logout,
        clearAuth,
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
