import type { CommonResponse, CursorBasedResponse } from "./common.ts";

export type Tag = {
  id: number;
  name?: string;
  tag?: { id: number; name: string };
};

export type Likes = {
  id: number;
  userId: number;
  lpId: number;
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

export type ResponseLpListDto = CursorBasedResponse<{
  data: Lp[];
  nextCursor: number | null;
  hasNext: boolean;
}>;

export type ResponseLpDto = CommonResponse<Lp>;
