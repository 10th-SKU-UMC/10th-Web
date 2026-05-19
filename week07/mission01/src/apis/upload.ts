import { axiosInstance } from "./axios";

export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await axiosInstance.post("/v1/uploads", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.data.imageUrl as string;
};
