import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { z } from "zod";

import { API_URL } from "@/constants";
import { apiClient } from "@/lib/api-client";

import { RoomRecentSchema } from "../schemas";
import { RoomRecent } from "../types";

type ListRecent = {
  userId: string;
};

export const listRecent = async (params: ListRecent): Promise<RoomRecent[]> => {
  const { data } = await apiClient.get(`/rooms/recent/${params.userId}`, {
    baseURL: API_URL,
  });
  return z.array(RoomRecentSchema).parse(data);
};

export const useListRecent = (params: ListRecent) => {
  const query = useQuery({
    queryKey: ["room-recent", params],
    queryFn: () => listRecent(params),
    enabled: !!params.userId,
  });

  useEffect(() => {
    if (query.isError) {
      console.error("Error fetching recent rooms:", query.error);
    }
  }, [query.error]);

  return query;
};
