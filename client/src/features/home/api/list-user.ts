import { useQuery } from "@tanstack/react-query";

import { API_URL } from "@/constants";
import { apiClient } from "@/lib/api-client";
import { User } from "@/features/auth";
import { UserSchema } from "@/features/auth/schemas";
import { Request } from "@/types";

type ListUser = Request;

export const listUser = async (params: ListUser): Promise<User[]> => {
  const { data } = await apiClient.get(`/users`, {
    baseURL: API_URL,
    params,
  });
  return UserSchema.array().parse(data);
};

type UserListUser = ListUser;

export const useListUser = (params: UserListUser) => {
  const query = useQuery({
    queryKey: ["user", params],
    queryFn: () => listUser(params),
  });
  return query;
};
