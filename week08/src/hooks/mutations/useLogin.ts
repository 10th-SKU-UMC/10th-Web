import { useMutation } from "@tanstack/react-query";
import { postSignin } from "../../apis/auth";
import { useAuth } from "../../context/AuthContext";
import type { RequestSigninDto } from "../../types/auth";

function useLogin() {
  const { setAuthTokens } = useAuth();

  return useMutation({
    mutationFn: (dto: RequestSigninDto) => postSignin(dto),
    onSuccess: ({ data }) => {
      setAuthTokens(data.accessToken, data.refreshToken);
    },
  });
}

export default useLogin;
