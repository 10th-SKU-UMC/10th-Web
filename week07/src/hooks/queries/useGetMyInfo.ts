import { useQuery } from "@tanstack/react-query";
import { getMyInfo } from "../../apis/auth";
import { QUERY_KEY } from "../../constants/key";

function useGetMyInfo(enabled: boolean) {
  return useQuery({
    queryKey: [QUERY_KEY.myInfo],
    queryFn: getMyInfo,
    enabled,
    staleTime: 1000 * 60 * 5,
  });
}

export default useGetMyInfo;
