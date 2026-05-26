import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postComment } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";

function usePostComment(lpId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (content: string) => postComment(lpId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.lpComments, lpId],
      });
    },
  });
}

export default usePostComment;
