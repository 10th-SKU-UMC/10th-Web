import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createLp } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";
import type { RequestCreateLpDto } from "../../types/lp";

function useCreateLp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: RequestCreateLpDto) => createLp(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.lps] });
    },
  });
}

export default useCreateLp;
