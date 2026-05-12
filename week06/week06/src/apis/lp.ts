import type { PaginationDto } from "../types/common";
import type { ResponseCommentListDto, ResponseLpDto, ResponseLpListDto } from "../types/lp";
import type { CommonResponse } from "../types/common";
import { axiosInstance } from "./axios";

export const getLp = async (lpId: number): Promise<ResponseLpDto> => {
  const { data } = await axiosInstance.get(`/v1/lps/${lpId}`);
  return data;
};

export const getLpList = async (
  paginationDto: PaginationDto,
): Promise<ResponseLpListDto> => {
  const { data } = await axiosInstance.get("/v1/lps", {
    params: paginationDto,
  });

  return data;
};

export const getCommentList = async (
  lpId: number,
  paginationDto: Omit<PaginationDto, "search">,
): Promise<ResponseCommentListDto> => {
  const { data } = await axiosInstance.get(`/v1/lps/${lpId}/comments`, {
    params: paginationDto,
  });

  return data;
};

export const postComment = async (
  lpId: number,
  content: string,
): Promise<CommonResponse<{ id: number; content: string }>> => {
  const { data } = await axiosInstance.post(`/v1/lps/${lpId}/comments`, {
    content,
  });

  return data;
};
