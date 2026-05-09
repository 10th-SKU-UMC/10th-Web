import { axiosInstance } from "./axios";
import type {
  LpListResponse,
  LpDetailResponse,
  LikeResponse,
  RequestCreateLpDto,
  SortOrder,
} from "./dto";

export const getLps = async (order: SortOrder = "desc"): Promise<LpListResponse> => {
  const { data } = await axiosInstance.get("/v1/lps", { params: { order } });
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
