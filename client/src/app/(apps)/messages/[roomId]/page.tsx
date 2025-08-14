"use client";

import { use } from "react";

import { FallbackError } from "@/components/fallback-error";
import { MessageContent } from "@/components/message-content";
import { MessageHeader } from "@/components/message-header";
import { MessageInput } from "@/components/message-input";
import { useGetRoom, useListMessage } from "@/features/home";
import { useSocketHandler, useUser, useUserStatus } from "@/hooks";

interface RoomPageProps {
  params: Promise<{ roomId: string }>;
}

export default function RoomPage({ params }: RoomPageProps) {
  const { user } = useUser();
  const { roomId } = use(params);

  const { data: roomData, isError } = useGetRoom({ roomId });
  const {
    allRows: messages,
    addMessage,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
  } = useListMessage({ roomId, limit: 25 });

  const userStatus = useUserStatus(roomData, user?._id);
  useSocketHandler(roomId, addMessage);

  return (
    <div className="flex-1 flex flex-col h-full">
      <FallbackError isError={isError} className="mt-6">
        <MessageHeader
          name={roomData?.name ?? ""}
          color={roomData?.color}
          isOnline={userStatus === "online"}
        />
        <MessageContent
          messages={messages}
          hasNextPage={hasNextPage}
          isLoading={isLoading}
          isFetchingNextPage={isFetchingNextPage}
          fetchNextPage={fetchNextPage}
        />
        <MessageInput roomId={roomId} />
      </FallbackError>
    </div>
  );
}
