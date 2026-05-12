import type { PaginationDto } from "../types/common.ts";
import type { ResponseLpDto, ResponseLpListDto } from "../types/lp.ts";
import { axiosInstance } from "./axios.ts";

export const getLpList = async (
  paginationDto: PaginationDto,
): Promise<ResponseLpListDto> => {
  const { data } = await axiosInstance.get("/v1/lps", {
    params: paginationDto,
  });

  return {
    ...data,
    nextCursor: data.nextCursor ?? null,
  };
};

export const getLp = async (lpid: number | string): Promise<ResponseLpDto> => {
  const { data } = await axiosInstance.get(`/v1/lps/${lpid}`);
  return data;
};

export const postLpLike = async (lpid: number | string) => {
  const { data } = await axiosInstance.post(`/v1/lps/${lpid}/likes`);
  return data;
};

export const deleteLpLike = async (lpid: number | string) => {
  const { data } = await axiosInstance.delete(`/v1/lps/${lpid}/likes`);
  return data;
};
