import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const decodeJwtSub = (token: string): number | undefined => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
    return payload.sub ? Number(payload.sub) : undefined;
  } catch {
    return undefined;
  }
};

export default function GoogleCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithTokens } = useAuth();

  useEffect(() => {
    const accessToken = searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");
    const name = searchParams.get("name") ?? undefined;

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
