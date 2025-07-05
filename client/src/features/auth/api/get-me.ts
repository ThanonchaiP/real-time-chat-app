import { useQuery } from "@tanstack/react-query";

import { API_URL } from "@/constants";
import { apiClient } from "@/lib/api-client";

import { User } from "../types";
import { UserSchema } from "../schemas";

export const getMe = async (): Promise<User> => {
  const { data } = await apiClient.get(`/auth/me`, {
    baseURL: API_URL,
  });
  return UserSchema.parse(data);
};

export const useGetMe = () => {
  const query = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
  });
  return query;
};
