"use client";

import { use, useEffect } from "react";

import { FallbackError } from "@/components/fallback-error";
import { MessageContent } from "@/components/message-content";
import { MessageHeader } from "@/components/message-header";
import { MessageInput } from "@/components/message-input";
import { Message } from "@/features/home/types";
import { useGetRoom, useListMessage } from "@/features/home";
import { useUser } from "@/hooks";

interface RoomPageProps {
  params: Promise<{ roomId: string }>;
}

export default function RoomPage({ params }: RoomPageProps) {
  const { roomId } = use(params);
  const { socket } = useUser();

  const { data: roomData, isError } = useGetRoom({ roomId });
  const {
    allRows,
    addMessage,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
  } = useListMessage({ roomId, limit: 25 });

  useEffect(() => {
    if (!roomData || !socket || !roomId) return;

    const handleNewMessage = (message: Message) => {
      addMessage(message);
    };

    socket.emit("join_room", { roomId });
    socket.on("new_message", handleNewMessage);

    return () => {
      socket.off("new_message", handleNewMessage);
      socket.emit("leave_room", { roomId });
    };
  }, [socket, roomId, roomData, addMessage]);

  return (
    <div className="flex-1 flex flex-col h-full">
      <FallbackError isError={isError} className="mt-6">
        <MessageHeader name={roomData?.name ?? ""} color={roomData?.color} />
        <MessageContent
          messages={allRows}
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
