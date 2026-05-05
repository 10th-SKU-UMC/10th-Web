import { useEffect } from "react";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import { setStorageItem } from "../hooks/useLocalStorage";

export const GoogleLoginRedirectPage = () => {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get(LOCAL_STORAGE_KEY.accessToken);
    const refreshToken = urlParams.get(LOCAL_STORAGE_KEY.refreshToken);

    if (accessToken) {
      setStorageItem(LOCAL_STORAGE_KEY.accessToken, accessToken);
      setStorageItem(LOCAL_STORAGE_KEY.refreshToken, refreshToken);
      window.location.href = "/mypage";
    }
  }, []);

  return <div></div>;
};

export default GoogleLoginRedirectPage;
