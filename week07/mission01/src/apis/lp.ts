import { axiosInstance } from "./axios";
import type {
  LpListResponse,
  LpDetailResponse,
  LikeResponse,
  RequestCreateLpDto,
  SortOrder,
  CommentListResponse,
  RequestCreateCommentDto,
  Comment,
} from "./dto";

export const getMyLps = async (order: SortOrder = "desc", cursor?: number): Promise<LpListResponse> => {
  const { data } = await axiosInstance.get("/v1/lps/user", {
    params: { order, ...(cursor !== undefined && cursor > 0 ? { cursor } : {}) },
  });
  return data;
};

export const getLikedLps = async (order: SortOrder = "desc", cursor?: number): Promise<LpListResponse> => {
  const { data } = await axiosInstance.get("/v1/lps/liked", {
    params: { order, ...(cursor !== undefined && cursor > 0 ? { cursor } : {}) },
  });
  return data;
};

export const getLps = async (order: SortOrder = "desc", cursor?: number): Promise<LpListResponse> => {
  const { data } = await axiosInstance.get("/v1/lps", {
    params: { order, ...(cursor !== undefined && cursor > 0 ? { cursor } : {}) },
  });
  return data;
};

export const getLpDetail = async (lpid: number): Promise<LpDetailResponse> => {
  const { data } = await axiosInstance.get(`/v1/lps/${lpid}`);
  return data;
};

export const createLp = async (body: RequestCreateLpDto): Promise<LpDetailResponse> => {
  const { data } = await axiosInstance.post("/v1/lps", body);
  return data;
};

export const updateLp = async (lpid: number, body: Partial<RequestCreateLpDto>): Promise<LpDetailResponse> => {
  const { data } = await axiosInstance.patch(`/v1/lps/${lpid}`, body);
  return data;
};

export const deleteLp = async (lpid: number): Promise<void> => {
  await axiosInstance.delete(`/v1/lps/${lpid}`);
};

export const addLike = async (lpid: number): Promise<LikeResponse> => {
  const { data } = await axiosInstance.post(`/v1/lps/${lpid}/likes`);
  return data;
};

export const removeLike = async (lpid: number): Promise<LikeResponse> => {
  const { data } = await axiosInstance.delete(`/v1/lps/${lpid}/likes`);
  return data;
};

export const getComments = async (
  lpId: number,
  order: SortOrder = "desc",
  cursor?: number
): Promise<CommentListResponse> => {
  const { data } = await axiosInstance.get(`/v1/lps/${lpId}/comments`, {
    params: { order, ...(cursor !== undefined && cursor > 0 ? { cursor } : {}) },
  });
  return data;
};

export const createComment = async (lpId: number, body: RequestCreateCommentDto): Promise<{ status: boolean; data: Comment }> => {
  const { data } = await axiosInstance.post(`/v1/lps/${lpId}/comments`, body);
  return data;
};

export const deleteComment = async (lpId: number, commentId: number): Promise<void> => {
  await axiosInstance.delete(`/v1/lps/${lpId}/comments/${commentId}`);
};

export const updateComment = async (lpId: number, commentId: number, body: RequestCreateCommentDto): Promise<{ status: boolean; data: Comment }> => {
  const { data } = await axiosInstance.patch(`/v1/lps/${lpId}/comments/${commentId}`, body);
  return data;
};
