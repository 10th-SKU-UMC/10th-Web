import { axiosInstance } from "./axios";
import type { UploadResponse } from "./dto";

export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  // FormData 전송 시 Content-Type 수동 지정 금지
  // → axios가 boundary 포함한 multipart/form-data를 자동 구성함
  const { data } = await axiosInstance.postForm<UploadResponse>("/v1/uploads", formData);
  return data.data.imageUrl;
};
