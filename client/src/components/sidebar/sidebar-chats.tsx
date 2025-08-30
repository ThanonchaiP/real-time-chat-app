import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import SimpleBar from "simplebar-react";

import { Message, useListRecent } from "@/features/home";
import { useChatStore } from "@/stores/user-store";
import { MenuKey } from "@/types";

import { SearchInput } from "../search-input";

import { ChatItem } from "./chat-item";
import { ChatSkeleton } from "./chat-skeleton";
import { EmptyRecentChats } from "./empty-recent-chats";

import "simplebar/dist/simplebar.min.css";

type SidebarChatsProps = {
  userId: string;
  onMenuChange: (menu: MenuKey) => void;
};

export const SidebarChats = ({ userId, onMenuChange }: SidebarChatsProps) => {
  const router = useRouter();
  const params = useParams();
  const socket = useChatStore((state) => state.socket);

  const userOnline = useChatStore((state) => state.userOnline);
  const { data, isLoading, mutate } = useListRecent({ userId });

  const [typingUsers, setTypingUsers] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!socket) return;

    const handleUserTyping = ({ roomId }: { roomId: string }) => {
      setTypingUsers((prev) => ({ ...prev, [roomId]: true }));
    };

    const handleUserTypingEnd = ({ roomId }: { roomId: string }) => {
      setTypingUsers((prev) => ({ ...prev, [roomId]: false }));
    };

    const handleNewMessage = (message: Message) => {
      mutate((currentData) => {
        return currentData
          .map((room) => {
            if (room._id === message.roomId) {
              return {
                ...room,
                lastMessage: {
                  _id: message._id,
                  content: message.content,
                  createdAt: message.createdAt,
                  contentType: message.contentType,
                  senderId: message.sender._id,
                  readBy: [
                    { userId: message.sender._id, readAt: message.createdAt },
                  ],
                },
              };
            }
            return room;
          })
          .sort(
            (a, b) =>
              new Date(b.lastMessage.createdAt).getTime() -
              new Date(a.lastMessage.createdAt).getTime()
          );
      }, false);
    };

    socket.on("user_typing", handleUserTyping);
    socket.on("user_typing_end", handleUserTypingEnd);
    socket.on("new_message", handleNewMessage);

    return () => {
      socket.off("user_typing", handleUserTyping);
      socket.off("user_typing_end", handleUserTypingEnd);
      socket.off("new_message", handleNewMessage);
    };
  }, [socket, mutate]);

  useEffect(() => {
    if (!data || !socket) return;

    data.forEach((room) => {
      socket.emit("join_room", { roomId: room._id });
    });
  }, [data, socket]);

  const roomId = params.roomId as string;

  const handleChatClick = (id: string) => {
    router.push(`/messages/${id}`);
  };

  return (
    <div className="h-full">
      <div className="p-6 pb-2">
        <h2 className="text-xl font-semibold mb-6">Chats</h2>
        <SearchInput
          placeholder="Search messages or users"
          onDebounce={(value) => console.log(value)}
        />
      </div>

      <h4 className="font-semibold m-6 mb-2">Recent</h4>
      <SimpleBar style={{ maxHeight: "calc(100vh - 200px)" }} autoHide={true}>
        {isLoading &&
          Array.from({ length: 10 }).map((_, index) => (
            <ChatSkeleton key={index} isRecent />
          ))}

        {!isLoading && (!data || data.length === 0) && (
          <EmptyRecentChats onClick={() => onMenuChange("users")} />
        )}

        {data?.map((room) => (
          <ChatItem
            typing={typingUsers[room._id] || false}
            data={room}
            color={room.color}
            key={room._id}
            onClick={handleChatClick}
            isActive={roomId === room._id}
            isOnline={userOnline[room.chatWithId ?? ""] === "online"}
          />
        ))}
      </SimpleBar>
    </div>
  );
};
