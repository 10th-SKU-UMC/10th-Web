import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateComment } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";

function useUpdateComment(lpId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId, content }: { commentId: number; content: string }) =>
      updateComment(lpId, commentId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.lpComments, lpId] });
    },
  });
}

export default useUpdateComment;
