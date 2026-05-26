import type { PaginationDto } from "../types/common";
import type { RequestCreateLpDto, RequestUpdateLpDto, ResponseCommentListDto, ResponseLpDto, ResponseLpListDto } from "../types/lp";
import type { CommonResponse } from "../types/common";
import { axiosInstance } from "./axios";

export const createLp = async (dto: RequestCreateLpDto): Promise<ResponseLpDto> => {
  const { data } = await axiosInstance.post("/v1/lps", dto);
  return data;
};

export const updateLp = async (lpId: number, dto: RequestUpdateLpDto): Promise<ResponseLpDto> => {
  const { data } = await axiosInstance.patch(`/v1/lps/${lpId}`, dto);
  return data;
};

export const deleteLp = async (lpId: number): Promise<void> => {
  await axiosInstance.delete(`/v1/lps/${lpId}`);
};

export const postLike = async (lpId: number): Promise<CommonResponse<{ id: number }>> => {
  const { data } = await axiosInstance.post(`/v1/lps/${lpId}/likes`);
  return data;
};

export const deleteLike = async (lpId: number): Promise<CommonResponse<null>> => {
  const { data } = await axiosInstance.delete(`/v1/lps/${lpId}/likes`);
  return data;
};

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

export const updateComment = async (
  lpId: number,
  commentId: number,
  content: string,
): Promise<CommonResponse<{ id: number; content: string }>> => {
  const { data } = await axiosInstance.patch(
    `/v1/lps/${lpId}/comments/${commentId}`,
    { content },
  );

  return data;
};

export const deleteComment = async (
  lpId: number,
  commentId: number,
): Promise<void> => {
  await axiosInstance.delete(`/v1/lps/${lpId}/comments/${commentId}`);
};
