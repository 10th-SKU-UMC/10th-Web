import { useInfiniteQuery } from "@tanstack/react-query";
import type { PAGINATION_ORDER } from "../../enums/common";
import { QUERY_KEY } from "../../constants/key";
import { getCommentList } from "../../apis/lp";

function useGetInfiniteCommentList(lpId: number, order: PAGINATION_ORDER) {
  return useInfiniteQuery({
    queryKey: [QUERY_KEY.lpComments, lpId, order],
    queryFn: ({ pageParam }) =>
      getCommentList(lpId, { cursor: pageParam, limit: 15, order }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.data.hasNext ? lastPage.data.nextCursor : undefined,
  });
}

export default useGetInfiniteCommentList;
