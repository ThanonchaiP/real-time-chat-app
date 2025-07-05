import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

import { API_URL } from "@/constants";
import { apiClient } from "@/lib/api-client";
import { Request } from "@/types";

import { RoomResponse } from "../types";
import { RoomResponseSchema } from "../schemas";

type ListRoom = Request & {
  type?: "direct" | "group";
};

export const listRoom = async (params: ListRoom): Promise<RoomResponse> => {
  const response = await apiClient.get(`/rooms`, {
    baseURL: API_URL,
    params,
  });
  return RoomResponseSchema.parse(response);
};

type UserListRoom = ListRoom;

export const useListRoom = (params: UserListRoom) => {
  const query = useQuery({
    queryKey: ["room", params],
    queryFn: () => listRoom(params),
  });

  useEffect(() => {
    if (query.isError) {
      console.error("Error fetching rooms:", query.error);
    }
  }, [query.isError, query.error]);

  return query;
};
