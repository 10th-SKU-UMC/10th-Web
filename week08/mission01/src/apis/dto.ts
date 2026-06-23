// ─── 공통 API 응답 래퍼 ───────────────────────────────────────
/** 서버 응답 공통 래퍼. 모든 Response 타입은 이 제네릭을 통해 정의한다. */
export interface ApiResponse<T> {
  status: boolean;
  statusCode: number;
  message: string;
  data: T;
}

/** 커서 기반 페이지네이션 응답 공통 구조 */
export interface PaginatedData<T> {
  data: T[];
  nextCursor: number | null;
  hasNext: boolean;
}

// ─── 인증 ─────────────────────────────────────────────────────
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

export interface RequestSigninDto {
  email: string;
  password: string;
}

/** signin / refresh 응답의 공통 data 구조 */
export interface AuthTokenData {
  id: number;
  name: string;
  accessToken: string;
  refreshToken: string;
}

export type ResponseSigninDto = ApiResponse<AuthTokenData>;

export interface RequestRefreshTokenDto {
  refresh: string;
}

export type ResponseRefreshTokenDto = ApiResponse<AuthTokenData>;

// ─── 유저 ─────────────────────────────────────────────────────
export interface UserProfile {
  id: number;
  name: string;
  email: string;
  bio: string | null;
  avatar: string | null;
}

export interface UpdateUserDto {
  name?: string;
  bio?: string;
  avatar?: string;
}

// ─── LP ───────────────────────────────────────────────────────
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

export type LpListResponse = ApiResponse<PaginatedData<Lp>>;
export type LpDetailResponse = ApiResponse<Lp>;
export type LikeResponse = ApiResponse<LpLike | null>;

export interface RequestCreateLpDto {
  title: string;
  content: string;
  thumbnail?: string;
  tags: string[];
  published: boolean;
}

// ─── 댓글 ─────────────────────────────────────────────────────
export interface Comment {
  id: number;
  content: string;
  authorId: number;
  lpId: number;
  createdAt: string;
  updatedAt: string;
  author?: LpAuthor;
}

export interface RequestCreateCommentDto {
  content: string;
}

export type CommentListResponse = ApiResponse<PaginatedData<Comment>>;
export type CommentResponse = ApiResponse<Comment>;

// ─── 업로드 ────────────────────────────────────────────────────
export interface UploadData {
  imageUrl: string;
}
export type UploadResponse = ApiResponse<UploadData>;
