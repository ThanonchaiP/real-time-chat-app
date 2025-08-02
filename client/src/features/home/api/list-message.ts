import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";

import { API_URL } from "@/constants";
import { apiClient } from "@/lib/api-client";
import { Request } from "@/types";

import { MessageResponseSchema } from "../schemas";
import { MessageResponse } from "../types";

type ListMessage = Request & {
  roomId: string;
};

export const listMessage = async ({
  roomId,
  ...params
}: ListMessage): Promise<MessageResponse> => {
  const response = await apiClient.get(`/messages/${roomId}`, {
    baseURL: API_URL,
    params,
  });
  return MessageResponseSchema.parse(response);
};

type UserListMessage = ListMessage;

export const useListMessage = (params: UserListMessage) => {
  const query = useInfiniteQuery({
    queryKey: ["messages", params.roomId],
    queryFn: ({ pageParam }) => listMessage({ ...params, page: pageParam }),
    getNextPageParam: (lastData) => {
      const lastPage = lastData?.meta?.page ?? 1;
      const hasNextPage = lastData.meta?.hasNextPage;
      const nextPage = lastPage + 1;
      if (!hasNextPage) return;
      return nextPage;
    },
    initialPageParam: 1,
  });

  const allRows = query.data
    ? query.data.pages.flatMap((d) => d?.data ?? []).reverse()
    : [];

  useEffect(() => {
    if (query.isError) {
      console.error("Error fetching messages:", query.error);
    }
  }, [query.isError, query.error]);

  return { ...query, allRows };
};
