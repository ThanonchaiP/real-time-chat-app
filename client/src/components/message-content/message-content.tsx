import { useVirtualizer } from "@tanstack/react-virtual";
import dayjs from "dayjs";
import { useEffect, useLayoutEffect, useRef } from "react";

import { useListMessage } from "@/features/home";
import { useUser } from "@/hooks";
import { cn } from "@/lib/utils";
import { getAvatarName } from "@/utils";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Spinner } from "../ui/spinner";

interface MessageContentProps {
  roomId: string;
}

export const MessageContent = ({ roomId }: MessageContentProps) => {
  const { user } = useUser();
  const parentRef = useRef<HTMLDivElement>(null);

  const userId = user?._id || "";

  const { allRows, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage } =
    useListMessage({ roomId, limit: 100 });

  const rowVirtualizer = useVirtualizer({
    overscan: 5,
    count: hasNextPage ? allRows.length + 1 : allRows.length,
    estimateSize: () => 100,
    getScrollElement: () => parentRef.current,
  });

  useLayoutEffect(() => {
    if (!parentRef.current || isLoading) return;

    const el = parentRef.current;

    if (rowVirtualizer.getTotalSize() > 0) {
      el.scrollTop = el.scrollHeight;
    }
  }, [isLoading, allRows.length, rowVirtualizer]);

  const prevScrollHeightRef = useRef<number>(0);

  useLayoutEffect(() => {
    if (!parentRef.current || !isFetchingNextPage) return;

    const el = parentRef.current;
    const prevScrollHeight = prevScrollHeightRef.current;

    requestAnimationFrame(() => {
      const newScrollHeight = el.scrollHeight;
      const diff = newScrollHeight - prevScrollHeight;
      el.scrollTop = diff;
    });
  }, [isFetchingNextPage]);

  useEffect(() => {
    const el = parentRef.current;
    if (!el) return;

    const handleScroll = () => {
      if (el.scrollTop <= 50 && hasNextPage && !isFetchingNextPage) {
        prevScrollHeightRef.current = el.scrollHeight;
        fetchNextPage();
      }
    };

    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      {/* Messages Container */}
      <div
        ref={parentRef}
        className="w-full p-4 overflow-y-auto"
        style={{ height: "calc(100vh - 137px)" }}
      >
        <div
          style={{
            height: rowVirtualizer.getTotalSize(),
            width: "100%",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              transform: `translateY(${
                rowVirtualizer.getVirtualItems()[0]?.start ?? 0
              }px)`,
            }}
          ></div>
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const index = virtualRow.index;
            // const isLoaderRow = index >= allRows.length;
            const message = allRows[index];

            return (
              <div
                key={virtualRow.key}
                data-index={virtualRow.index}
                ref={rowVirtualizer.measureElement}
              >
                <div
                  className={cn(
                    "flex items-end gap-2 py-2",
                    message.senderId === userId
                      ? "justify-end"
                      : "justify-start"
                  )}
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
              </div>
            );
          })}
        </div>
      </div>
      {/* Scroll to bottom button */}
      {/* {showScrollButton && (
        <button
          onClick={scrollToBottom}
          className="fixed bottom-20 right-6 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
        >
          <ChevronDown className="w-5 h-5" />
        </button>
      )} */}
    </>
  );
};
