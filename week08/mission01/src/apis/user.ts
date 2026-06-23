import { axiosInstance } from "./axios";
import type { ApiResponse, UserProfile, UpdateUserDto } from "./dto";

export type { UserProfile, UpdateUserDto } from "./dto";

export const getMyInfo = async (): Promise<UserProfile> => {
  const { data } = await axiosInstance.get<ApiResponse<UserProfile>>("/v1/users/me");
  return data.data;
};

export const updateMyInfo = async (body: UpdateUserDto): Promise<UserProfile> => {
  const { data } = await axiosInstance.patch<ApiResponse<UserProfile>>("/v1/users", body);
  return data.data;
};
