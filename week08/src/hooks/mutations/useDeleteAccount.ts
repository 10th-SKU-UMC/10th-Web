import { useMutation } from "@tanstack/react-query";
import { deleteAccount } from "../../apis/auth";

function useDeleteAccount() {
  return useMutation({
    mutationFn: deleteAccount,
  });
}

export default useDeleteAccount;
