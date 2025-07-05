import { useMutation } from "@tanstack/react-query";

import { API_URL } from "@/constants";
import { apiClient } from "@/lib/api-client";

type GetRoomByUser = {
  userId: string;
};

export const getRoomByUser = async ({
  userId,
}: GetRoomByUser): Promise<string> => {
  const response = await apiClient.get(`/rooms/user/${userId}`, {
    baseURL: API_URL,
  });
  return response.data;
};

type UserGetRoomByUser = GetRoomByUser & {
  onSuccess?: (roomId: string) => void;
};

export const useGetRoomByUser = ({
  onSuccess,
  ...params
}: UserGetRoomByUser) => {
  const query = useMutation({
    mutationKey: ["room-user", params],
    mutationFn: () => getRoomByUser(params),
    onError: (error) => {
      console.error("Error fetching room by user:", error);
    },
    onSuccess: (data) => {
      onSuccess?.(data);
    },
  });

  return query;
};
