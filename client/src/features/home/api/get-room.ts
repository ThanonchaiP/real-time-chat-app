import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

import { API_URL } from "@/constants";
import { apiClient } from "@/lib/api-client";

import { RoomSchema } from "../schemas";
import { Room } from "../types";

type GetRoom = {
  roomId: string;
};

export const getRoom = async ({ roomId }: GetRoom): Promise<Room> => {
  const { data } = await apiClient.get(`/rooms/${roomId}`, {
    baseURL: API_URL,
  });
  return RoomSchema.parse(data);
};

type UserGetRoom = GetRoom;

export const useGetRoom = (params: UserGetRoom) => {
  const query = useQuery({
    queryKey: ["room", params],
    queryFn: () => getRoom(params),
  });

  useEffect(() => {
    if (query.isError) {
      console.error(query.error);
    }
  }, [query.isError, query.error]);

  return query;
};
