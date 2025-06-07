import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

import { API_URL } from "@/constants";
import { apiClient, ApiErrorResponse } from "@/lib/api-client";

type RegisterBody = {
  email: string;
  password: string;
  name: string;
};

export const register = async (data: RegisterBody) => {
  return await apiClient.post(`/auth/signup`, data, {
    baseURL: API_URL,
  });
};

type UseRegister = {
  onSuccess?: () => void;
};

export const useRegister = ({ onSuccess }: UseRegister) => {
  const query = useMutation({
    mutationFn: register,
    onSuccess: () => {
      onSuccess?.();
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      toast.error(
        error.response?.data.message ?? "Registration failed. Please try again."
      );
    },
  });

  return query;
};
