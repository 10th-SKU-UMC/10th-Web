export interface RequestSigninDto {
  email: string;
  password: string;
}

export interface ResponseSigninDto {
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

// LP Types
export interface LpAuthor {
  id: number;
  name: string;
  email?: string;
  bio?: string | null;
  avatar?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface LpTag {
  id: number;
  name: string;
}

export interface LpLike {
  id: number;
  userId: number;
  lpId: number;
}

export interface Lp {
  id: number;
  title: string;
  content: string;
  thumbnail: string | null;
  published?: boolean;
  authorId: number;
  author?: LpAuthor;
  createdAt: string;
  updatedAt: string;
  tags: LpTag[];
  likes: LpLike[];
}

export type SortOrder = "asc" | "desc";

export interface LpListResponse {
  status: boolean;
  statusCode: number;
  message: string;
  data: {
    data: Lp[];
    nextCursor: number | null;
    hasNext: boolean;
  };
}

export interface LpDetailResponse {
  status: boolean;
  statusCode: number;
  message: string;
  data: Lp;
}

export interface RequestCreateLpDto {
  title: string;
  content: string;
  thumbnail?: string;
  tags?: string[];
  published?: boolean;
}

export interface LikeResponse {
  status: boolean;
  statusCode: number;
  message: string;
  data: LpLike | null;
}
