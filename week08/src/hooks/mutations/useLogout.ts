import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { postLogout } from "../../apis/auth";
import { useAuth } from "../../context/AuthContext";

function useLogout() {
  const { clearAuth } = useAuth();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: postLogout,
    onSettled: () => {
      clearAuth();
      navigate("/");
    },
  });
}

export default useLogout;
