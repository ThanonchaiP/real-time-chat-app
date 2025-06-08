import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

import { API_URL } from "@/constants";
import { apiClient, ApiErrorResponse } from "@/lib/api-client";

type Payload = {
  email: string;
  password: string;
};

export const signin = async (data: Payload) => {
  return await apiClient.post(`/auth/signin`, data, {
    baseURL: API_URL,
  });
};

type UseSignin = {
  onSuccess?: () => void;
};

export const useSignin = ({ onSuccess }: UseSignin) => {
  const query = useMutation({
    mutationFn: signin,
    onSuccess: () => {
      onSuccess?.();
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      toast.error(
        error.response?.data.message ?? "Sign in failed. Please try again."
      );
    },
  });

  return query;
};
