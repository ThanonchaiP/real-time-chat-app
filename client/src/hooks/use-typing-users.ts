import { useState, useEffect } from "react";

import { useChatStore } from "@/stores/user-store";

interface TypingUser {
  userId: string;
  roomId: string;
}

export const useTypingUsers = (roomId: string) => {
  const { socket } = useChatStore();
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!socket) return;

    const handleUserTyping = (data: TypingUser) => {
      if (data.roomId === roomId) {
        setTypingUsers((prev) => new Set([...prev, data.userId]));
      }
    };

    const handleUserTypingEnd = (data: TypingUser) => {
      if (data.roomId === roomId) {
        setTypingUsers((prev) => {
          const newSet = new Set(prev);
          newSet.delete(data.userId);
          return newSet;
        });
      }
    };

    socket.on("user_typing", handleUserTyping);
    socket.on("user_typing_end", handleUserTypingEnd);

    return () => {
      socket.off("user_typing", handleUserTyping);
      socket.off("user_typing_end", handleUserTypingEnd);
    };
  }, [socket, roomId]);

  return Array.from(typingUsers);
};
