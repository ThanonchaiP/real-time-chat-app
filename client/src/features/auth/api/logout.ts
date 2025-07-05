import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

import { API_URL } from "@/constants";
import { apiClient, ApiErrorResponse } from "@/lib/api-client";

export const logout = async () => {
  return await apiClient.post(`/auth/logout`, undefined, {
    baseURL: API_URL,
  });
};

type UseLogout = {
  onSuccess?: () => void;
};

export const useLogout = ({ onSuccess }: UseLogout) => {
  const query = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      onSuccess?.();
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      toast.error(
        error.response?.data.message ?? "Logout failed. Please try again."
      );
    },
  });

  return query;
};
