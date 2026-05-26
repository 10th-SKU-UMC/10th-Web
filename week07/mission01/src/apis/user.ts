import { axiosInstance } from "./axios";

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  bio: string | null;
  avatar: string | null;
}

interface UserResponse {
  status: boolean;
  statusCode: number;
  message: string;
  data: UserProfile;
}

export interface UpdateUserDto {
  name?: string;
  bio?: string;
  avatar?: string;
}

export const getMyInfo = async (): Promise<UserProfile> => {
  const { data } = await axiosInstance.get<UserResponse>("/v1/users/me");
  return data.data;
};

export const updateMyInfo = async (body: UpdateUserDto): Promise<UserProfile> => {
  const { data } = await axiosInstance.patch<UserResponse>("/v1/users", body);
  return data.data;
};
