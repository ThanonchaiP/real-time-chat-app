import { useMutation } from "@tanstack/react-query";

import { API_URL } from "@/constants";
import { apiClient } from "@/lib/api-client";

import { UploadFileResponse } from "../types";
import { UploadFileResponseSchema } from "../schemas";

export const uploadImage = async (file: File): Promise<UploadFileResponse> => {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await apiClient.post(`/messages/upload`, formData, {
    baseURL: API_URL,
    headers: { "Content-Type": "multipart/form-data" },
  });

  return UploadFileResponseSchema.parse(data);
};

interface UseUploadImage {
  onSuccess: (data: UploadFileResponse) => void;
  onError?: () => void;
}

export const useUploadImage = ({ onSuccess, onError }: UseUploadImage) => {
  const query = useMutation({
    mutationFn: uploadImage,
    onSuccess: (data) => {
      onSuccess(data);
    },
    onError: () => {
      onError?.();
    },
  });
  return query;
};
