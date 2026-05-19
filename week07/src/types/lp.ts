import type { CommonResponse, CursorBasedResponse } from "./common";

export type Tag = {
  id: number;
  name: string;
};

export type Likes = {
  id: number;
  userId: number;
  lpId: number;
};

export type LpDto = {
  id: number;
  title: string;
  content: string;
  thumbnail: string;
  published: boolean;
  authorId: number;
  createdAt: Date;
  updatedAt: Date;
  tags: Tag[];
  likes: Likes[];
};

export type Lp = {
  id: number;
  title: string;
  content: string;
  thumbnail: string;
  published: boolean;
  authorId: number;
  createdAt: Date;
  updatedAt: Date;
  tags: Tag[];
  likes: Likes[];
};

export type RequestLpDto = {
  lpId: number;
};

export type RequestCreateLpDto = {
  title: string;
  content: string;
  thumbnail?: string;
  tags: string[];
  published: boolean;
};

export type RequestUpdateLpDto = {
  title?: string;
  content?: string;
  thumbnail?: string;
  tags?: string[];
  published?: boolean;
};

export type ResponseLpDto = CommonResponse<LpDto>;

export type ResponseLpListDto = CursorBasedResponse<Lp[]>;

export type CommentAuthor = {
  id: number;
  name: string;
  profileImage?: string | null;
};

export type Comment = {
  id: number;
  content: string;
  lpId: number;
  authorId: number;
  createdAt: Date;
  updatedAt: Date;
  author?: CommentAuthor;
};

export type ResponseCommentListDto = CursorBasedResponse<Comment[]>;
