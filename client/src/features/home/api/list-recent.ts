import { useQuery } from "@tanstack/react-query";

import { API_URL } from "@/constants";
import { apiClient } from "@/lib/api-client";

type ListRecent = {
  userId: string;
};

export const listRecent = async (params: ListRecent): Promise<any> => {
  const response = await apiClient.get(`/rooms/recent/${params.userId}`, {
    baseURL: API_URL,
  });
  return response;
};

export const useListRecent = (params: ListRecent) => {
  const query = useQuery({
    queryKey: ["room-recent", params],
    queryFn: () => listRecent(params),
    enabled: !!params.userId,
  });

  return query;
};
