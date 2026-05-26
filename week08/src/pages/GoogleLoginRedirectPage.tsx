import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { OAUTH_QUERY_KEY } from "../constants/key";

const GoogleLoginRedirectPage = () => {
  const { setAuthTokens } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get(OAUTH_QUERY_KEY.accessToken);
    const refreshToken = urlParams.get(OAUTH_QUERY_KEY.refreshToken);

    if (accessToken && refreshToken) {
      setAuthTokens(accessToken, refreshToken);
      navigate("/my", { replace: true });
    }
  }, [setAuthTokens, navigate]);

  return <div>구글 로그인 리다이렉트 화면</div>;
};

export default GoogleLoginRedirectPage;
