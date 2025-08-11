import {
  InfiniteData,
  useInfiniteQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useCallback, useEffect, useMemo } from "react";

import { API_URL } from "@/constants";
import { apiClient } from "@/lib/api-client";
import { Request } from "@/types";

import { MessageResponseSchema } from "../schemas";
import { Message, MessageResponse } from "../types";

type ListMessage = Request & {
  roomId: string;
};

type InfiniteMessageData = InfiniteData<MessageResponse>;

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
  const queryClient = useQueryClient();
  const queryKey = useMemo(() => ["messages", params.roomId], [params.roomId]);

  const query = useInfiniteQuery({
    queryKey,
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

  useEffect(() => {
    if (query.isError) {
      console.error("Error fetching messages:", query.error);
    }
  }, [query.isError, query.error]);

  const allRows = query.data
    ? query.data.pages.flatMap((d) => d?.data ?? []).reverse()
    : [];

  const addMessage = useCallback(
    (newMessage: Message) => {
      queryClient.setQueryData<InfiniteMessageData>(queryKey, (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page: MessageResponse, index: number) => {
            if (index === 0) {
              return {
                ...page,
                data: [newMessage, ...(page.data || [])],
              };
            }
            return page;
          }),
        };
      });
    },
    [queryClient, queryKey]
  );

  useEffect(() => {
    return () => {
      if (queryClient.getQueryData(queryKey)) {
        queryClient.setQueryData(queryKey, (data: InfiniteMessageData) => {
          return {
            pages: data.pages.slice(0, 1),
            pageParams: data.pageParams.slice(0, 1),
          };
        });
      }
    };
  }, [queryClient, queryKey]);

  return { ...query, allRows, addMessage };
};
