import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

import { API_URL } from "@/constants";
import { apiClient } from "@/lib/api-client";

export const listOnlineUser = async (): Promise<
  Record<string, "online" | "offline">
> => {
  const { data } = await apiClient.get(`/users/online`, {
    baseURL: API_URL,
  });
  return data;
};

export const useListOnlineUser = () => {
  const query = useQuery({
    queryKey: ["user-online"],
    queryFn: () => listOnlineUser(),
  });

  useEffect(() => {
    if (query.isError) {
      console.error("Error fetching online users:", query.error);
    }
  }, [query.isError, query.error]);

  return query;
};
