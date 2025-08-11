import dayjs from "dayjs";
import { useEffect, useLayoutEffect, useRef, useCallback } from "react";
import { VList, VListHandle } from "virtua";

import { Message } from "@/features/home/types";
import { useUser } from "@/hooks";
import { cn } from "@/lib/utils";
import { getAvatarName } from "@/utils";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Spinner } from "../ui/spinner";

interface MessageContentProps {
  messages: Message[];
  hasNextPage: boolean;
  isLoading: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
}

export const MessageContent = ({
  messages,
  hasNextPage,
  isLoading,
  isFetchingNextPage,
  fetchNextPage,
}: MessageContentProps) => {
  const { user } = useUser();

  const parentRef = useRef<HTMLDivElement>(null);
  const ref = useRef<VListHandle>(null);
  const isPrepend = useRef<boolean>(false);
  const shouldStickToBottom = useRef<boolean>(true);
  const hasFetchedRef = useRef<boolean>(false);
  const isInitialized = useRef<boolean>(false);

  const userId = user?._id || "";

  useLayoutEffect(() => {
    isPrepend.current = false;
  });

  useEffect(() => {
    if (!ref.current) return;
    if (!shouldStickToBottom.current) return;
    ref.current.scrollToIndex(messages.length - 1, {
      align: "end",
    });

    if (messages.length > 0) {
      setTimeout(() => {
        isInitialized.current = true;
      }, 100);
    }
  }, [messages.length]);

  useEffect(() => {
    if (!isFetchingNextPage) {
      hasFetchedRef.current = false;
    }
  }, [isFetchingNextPage]);

  useEffect(() => {
    isInitialized.current = false;
  }, [messages.length === 0]);

  const handleScroll = useCallback(
    (offset: number) => {
      if (!ref.current) return;

      shouldStickToBottom.current =
        offset - ref.current.scrollSize + ref.current.viewportSize >= -1.5;

      if (offset < 100) {
        isPrepend.current = true;

        if (!hasNextPage || isFetchingNextPage || hasFetchedRef.current) {
          return;
        }

        hasFetchedRef.current = true;
        fetchNextPage();
      }
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage]
  );

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div
      ref={parentRef}
      className="w-full flex-1 pl-4 overflow-y-auto relative"
      style={{ overflowAnchor: "none" }}
    >
      <VList
        ref={ref}
        className={cn(
          "flex-1 pr-2 [&::-webkit-scrollbar]:w-2",
          "[&::-webkit-scrollbar-track]:bg-gray-200",
          "[&::-webkit-scrollbar-thumb]:bg-gray-400"
        )}
        reverse
        shift={isPrepend.current}
        onScroll={handleScroll}
      >
        {messages.map((message) => (
          <div
            className={cn(
              "flex items-end gap-2 py-2",
              message.senderId === userId ? "justify-end" : "justify-start"
            )}
            key={message._id}
          >
            <Avatar
              className={cn(
                "size-[35px]",
                message.senderId === userId ? "order-2" : "order-1"
              )}
            >
              <AvatarImage src="" />
              <AvatarFallback
                className="text-white"
                style={{ backgroundColor: "#4A90E2" }}
              >
                {getAvatarName("Non")}
              </AvatarFallback>
            </Avatar>
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.senderId === userId
                  ? "bg-blue-500 text-white order-1"
                  : "bg-[#F5F7FB] text-gray-800 order-2"
              }`}
            >
              <p className="text-base">{message.content}</p>
              <p
                className={cn(
                  "text-xs mt-1",
                  message.senderId === userId
                    ? "text-blue-100"
                    : "text-right text-gray-500"
                )}
              >
                {dayjs(message.createdAt).format("HH:mm")}
              </p>
            </div>
          </div>
        ))}
      </VList>
    </div>
  );
};
