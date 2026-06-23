import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

// 백엔드 OAuth 콜백 쿼리 파라미터 키 상수
const OAUTH_QUERY_KEY = {
  accessToken: "accessToken",
  refreshToken: "refreshToken",
  name: "name",
} as const;

const decodeJwtSub = (token: string): number | undefined => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
    if (payload?.sub === undefined || payload?.sub === null) return undefined;
    const parsed = Number(payload.sub);
    // NaN·Infinity 방어: 정수 여부를 확인해 통과 못 하면 undefined 반환
    return Number.isFinite(parsed) ? parsed : undefined;
  } catch {
    return undefined;
  }
};

export default function GoogleCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithTokens } = useAuth();

  useEffect(() => {
    const accessToken = searchParams.get(OAUTH_QUERY_KEY.accessToken);
    const refreshToken = searchParams.get(OAUTH_QUERY_KEY.refreshToken);
    const name = searchParams.get(OAUTH_QUERY_KEY.name) ?? undefined;

    if (accessToken && refreshToken) {
      const userId = decodeJwtSub(accessToken);
      loginWithTokens(accessToken, refreshToken, name, userId);
      navigate("/", { replace: true });
    } else {
      navigate("/login", { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-black text-white">
      로그인 처리 중...
    </div>
  );
}
