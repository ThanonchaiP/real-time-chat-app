import { useQuery } from "@tanstack/react-query";

import { API_URL } from "@/constants";
import { apiClient } from "@/lib/api-client";

export const getMe = async () => {
  return await apiClient.get(`/auth/me`, {
    baseURL: API_URL,
  });
};

export const useGetMe = () => {
  const query = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
  });
  return query;
};
