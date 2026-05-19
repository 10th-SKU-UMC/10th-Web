import type {
  RequestSignupDto,
  RequestSigninDto,
  RequestUpdateMyInfoDto,
  ResponseMyInfoDto,
  ResponseSignupDto,
  ResponseSigninDto,
} from "../types/auth";
import { axiosInstance } from "./axios";

export const postRefresh = async (body: {
  refresh: string;
}): Promise<ResponseSigninDto> => {
  const { data } = await axiosInstance.post("/v1/auth/refresh", body);
  return data;
};

export const postSignup = async (
  body: RequestSignupDto,
): Promise<ResponseSignupDto> => {
  const { data } = await axiosInstance.post("/v1/auth/signup", body);

  return data;
};

export const postSignin = async (
  body: RequestSigninDto,
): Promise<ResponseSigninDto> => {
  const { data } = await axiosInstance.post("/v1/auth/signin", body);

  return data;
};

export const getMyInfo = async (): Promise<ResponseMyInfoDto> => {
  const { data } = await axiosInstance.get("/v1/users/me");

  return data;
};

export const postLogout = async () => {
  const { data } = await axiosInstance.post("/v1/auth/signout");

  return data;
};

export const deleteAccount = async (): Promise<void> => {
  await axiosInstance.delete("/v1/users");
};

export const patchMyInfo = async (
  dto: RequestUpdateMyInfoDto,
): Promise<ResponseMyInfoDto> => {
  if (dto.avatar instanceof File) {
    const formData = new FormData();
    formData.append("name", dto.name);
    if (dto.bio) formData.append("bio", dto.bio);
    formData.append("avatar", dto.avatar);

    const { data } = await axiosInstance.patch("/v1/users", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  }

  const { data } = await axiosInstance.patch("/v1/users", {
    name: dto.name,
    bio: dto.bio,
  });
  return data;
};