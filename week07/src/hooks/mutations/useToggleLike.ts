import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postLike, deleteLike } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";
import type { ResponseLpDto } from "../../types/lp";

type ToggleLikeVariables = {
  isLiked: boolean;
  userId: number;
};

function useToggleLike(lpId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ isLiked }: ToggleLikeVariables) =>
      isLiked ? deleteLike(lpId) : postLike(lpId),

    onMutate: async ({ isLiked, userId }) => {
      await queryClient.cancelQueries({ queryKey: [QUERY_KEY.lp, lpId] });

      const previousLp = queryClient.getQueryData<ResponseLpDto>([QUERY_KEY.lp, lpId]);

      queryClient.setQueryData<ResponseLpDto>([QUERY_KEY.lp, lpId], (old) => {
        if (!old) return old;
        const newLikes = isLiked
          ? old.data.likes.filter((like) => like.userId !== userId)
          : [...old.data.likes, { id: Date.now(), userId, lpId }];

        return { ...old, data: { ...old.data, likes: newLikes } };
      });

      return { previousLp };
    },

    onError: (_err, _vars, context) => {
      queryClient.setQueryData([QUERY_KEY.lp, lpId], context?.previousLp);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.lp, lpId] });
    },
  });
}

export default useToggleLike;
