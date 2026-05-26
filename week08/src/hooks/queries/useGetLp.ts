import { useQuery } from "@tanstack/react-query";
import { getLp } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";

function useGetLp(lpId: number) {
  return useQuery({
    queryKey: [QUERY_KEY.lp, lpId],
    queryFn: () => getLp(lpId),
  });
}

export default useGetLp;
