import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchMyInfo } from "../../apis/auth";
import { QUERY_KEY } from "../../constants/key";
import type { RequestUpdateMyInfoDto, ResponseMyInfoDto } from "../../types/auth";

function useUpdateMyInfo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: RequestUpdateMyInfoDto) => patchMyInfo(dto),

    onMutate: async (dto) => {
      // 진행 중인 refetch가 낙관적 업데이트를 덮어쓰지 않도록 취소
      await queryClient.cancelQueries({ queryKey: [QUERY_KEY.myInfo] });

      // 롤백용 이전 값 저장
      const previousMyInfo = queryClient.getQueryData<ResponseMyInfoDto>([QUERY_KEY.myInfo]);

      // 캐시를 즉시 업데이트 (Navbar·MyPage 동시 반영)
      queryClient.setQueryData<ResponseMyInfoDto>([QUERY_KEY.myInfo], (old) => {
        if (!old) return old;
        return {
          ...old,
          data: {
            ...old.data,
            name: dto.name,
            bio: dto.bio ?? old.data.bio,
          },
        };
      });

      return { previousMyInfo };
    },

    onError: (_err, _dto, context) => {
      // 실패 시 이전 값으로 롤백
      queryClient.setQueryData([QUERY_KEY.myInfo], context?.previousMyInfo);
    },

    onSettled: () => {
      // 성공·실패 모두 서버 상태와 동기화
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.myInfo] });
    },
  });
}

export default useUpdateMyInfo;
