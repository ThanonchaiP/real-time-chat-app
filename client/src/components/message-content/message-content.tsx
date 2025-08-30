import relativeTime from "dayjs/plugin/relativeTime";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { useEffect, useLayoutEffect, useRef, useCallback } from "react";
import { VList, VListHandle } from "virtua";
import dayjs from "dayjs";

import { Message } from "@/features/home/types";
import { usePageFocus, useUser } from "@/hooks";
import { cn } from "@/lib/utils";
import { useChatStore } from "@/stores/user-store";

import { MessageItem } from "../message-item";
import { TypingIndicator } from "../typing-indicator";
import { Spinner } from "../ui/spinner";

import "dayjs/locale/th";

dayjs.extend(relativeTime);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.locale("th");

interface MessageContentProps {
  messages: Message[];
  hasNextPage: boolean;
  isLoading: boolean;
  isFetchingNextPage: boolean;
  roomId?: string;
  fetchNextPage: () => void;
}

export const MessageContent = ({
  messages,
  hasNextPage,
  isLoading,
  isFetchingNextPage,
  roomId,
  fetchNextPage,
}: MessageContentProps) => {
  const { user } = useUser();
  const isFocused = usePageFocus();
  const socket = useChatStore((state) => state.socket);

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

    // Mark as read when new message arrives and user is at bottom
    if (
      messages.length > 0 &&
      shouldStickToBottom.current &&
      socket &&
      roomId &&
      isFocused
    ) {
      const timer = setTimeout(() => {
        socket.emit("mark_room_as_read", { roomId });
      }, 500);

      return () => clearTimeout(timer);
    }

    if (messages.length > 0) {
      setTimeout(() => {
        isInitialized.current = true;
      }, 100);
    }
  }, [messages.length, socket, roomId, isFocused]);

  useEffect(() => {
    if (!isFetchingNextPage) {
      hasFetchedRef.current = false;
    }
  }, [isFetchingNextPage]);

  useEffect(() => {
    isInitialized.current = false;
  }, [messages.length]);

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
        {messages.map((message, index) => {
          if (message.status === "typing") {
            return <TypingIndicator key={message._id} />;
          }

          const currentDate = dayjs(message.createdAt);
          const previousDate =
            index > 0 ? dayjs(messages[index - 1].createdAt) : null;

          const shouldShowDate =
            !previousDate || !currentDate.isSame(previousDate, "day");

          const formatDate = (date: dayjs.Dayjs) => {
            const today = dayjs();
            const yesterday = today.subtract(1, "day");

            if (date.isSame(today, "day")) {
              return "วันนี้";
            } else if (date.isSame(yesterday, "day")) {
              return "เมื่อวาน";
            } else {
              return date.format("dddd, D MMMM YYYY");
            }
          };

          return (
            <div key={message._id}>
              {shouldShowDate && (
                <div className="flex justify-center my-4">
                  <span className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {formatDate(currentDate)}
                  </span>
                </div>
              )}
              <MessageItem message={message} userId={userId} />
            </div>
          );
        })}
      </VList>
    </div>
  );
};
