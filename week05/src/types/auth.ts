import type { CommonResponse } from "./common";

// 로컬 스토리지에 저장되는 유저 정보 타입
export type User = {
  email: string;
  password: string;
};

// 회원가입 요청/응답 타입
export type RequestSignupDto = {
  name: string;
  email: string;
  password: string;
};

export type ResponseSignupDto = CommonResponse<{
  id: number;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}>;

// 로그인 요청/응답 타입
export type RequestSigninDto = {
  email: string;
  password: string;
};

export type ResponseSigninDto = CommonResponse<{
  id: number;
  name: string;
  accessToken: string;
  refreshToken?: string;
}>;

// 토큰 재발급 요청/응답 타입
export type RequestRefreshDto = {
  refresh: string;
};

export type ResponseRefreshDto = CommonResponse<{
  accessToken: string;
  refreshToken: string;
}>;

// 내 정보 조회 응답 타입
export type ResponseMyInfoDto = CommonResponse<{
  id: number;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}>;
