import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateLp } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";
import type { RequestUpdateLpDto } from "../../types/lp";

function useUpdateLp(lpId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: RequestUpdateLpDto) => updateLp(lpId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.lp, lpId] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.lps] });
    },
  });
}

export default useUpdateLp;
