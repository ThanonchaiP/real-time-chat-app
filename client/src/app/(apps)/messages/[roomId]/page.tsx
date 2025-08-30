"use client";

import { use, useEffect } from "react";

import { FallbackError } from "@/components/fallback-error";
import { MessageContent } from "@/components/message-content";
import { MessageHeader } from "@/components/message-header";
import { MessageInput } from "@/components/message-input";
import { useGetRoom, useListMessage } from "@/features/home";
import {
  useSocketHandler,
  useUser,
  useUserStatus,
  useTypingUsers,
} from "@/hooks";
import { useChatStore } from "@/stores/user-store";

interface RoomPageProps {
  params: Promise<{ roomId: string }>;
}

const typingMessage = {
  _id: "typing-indicator",
  roomId: "",
  sender: { _id: "", name: "", color: "" },
  content: "กำลังพิมพ์",
  contentType: "text",
  attachments: [],
  status: "typing",
  isEdited: false,
  readBy: [],
  reactions: [],
  createdAt: "",
  updatedAt: "",
};

export default function RoomPage({ params }: RoomPageProps) {
  const { user } = useUser();
  const { roomId } = use(params);
  const socket = useChatStore((state) => state.socket);

  const { data: roomData, isError } = useGetRoom({ roomId });
  const {
    allRows: messages,
    addMessage,
    fetchNextPage,
    updateMessageReadBy,
    updateRoomMessagesReadBy,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
  } = useListMessage({ roomId, limit: 25 });

  const userStatus = useUserStatus(roomData, user?._id);
  useSocketHandler(roomId, addMessage);

  const typingUserIds = useTypingUsers(roomId);
  const isTyping = typingUserIds.length > 0;

  useEffect(() => {
    if (!socket) return;

    socket.on("message_read", ({ messageId, userId, readAt }) => {
      updateMessageReadBy(messageId, userId, readAt);
    });

    socket.on("room_messages_read", ({ roomId: room, userId, readAt }) => {
      if (roomId === room) {
        updateRoomMessagesReadBy(userId, readAt);
      }
    });

    return () => {
      socket.off("message_read");
      socket.off("room_messages_read");
    };
  }, [socket, roomId, updateMessageReadBy, updateRoomMessagesReadBy]);

  useEffect(() => {
    if (!roomId || !socket) return;
    socket.emit("mark_room_as_read", { roomId: roomId });
  }, [roomId, socket]);

  return (
    <div className="flex-1 flex flex-col h-full">
      <FallbackError isError={isError} className="mt-6">
        <MessageHeader
          name={roomData?.name ?? ""}
          color={roomData?.color}
          isOnline={userStatus === "online"}
        />
        <MessageContent
          roomId={roomId}
          messages={isTyping ? [...messages, typingMessage] : messages}
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
