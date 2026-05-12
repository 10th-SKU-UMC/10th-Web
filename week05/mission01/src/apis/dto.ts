export interface RequestSigninDto {
  email: string;
  password: string;
}

export interface ResponseSigninDto {
  accessToken: string;
  refreshToken: string;
}

export interface RequestSignupDto {
  email: string;
  password: string;
  name?: string;
}

export interface ResponseSignupDto {
  id: number;
  email: string;
  name?: string;
}

export interface ResponseMyInfoDto {
  id: number;
  email: string;
  name: string;
}

export interface RequestRefreshTokenDto {
  refresh: string;
}

export interface ResponseRefreshTokenDto {
  status: boolean;
  statusCode: number;
  message: string;
  data: {
    id: number;
    name: string;
    accessToken: string;
    refreshToken: string;
  };
}