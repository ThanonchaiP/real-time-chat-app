import { useEffect } from "react";

import { Message } from "@/features/home";
import { useChatStore } from "@/stores/user-store";

export const useSocketHandler = (
  roomId: string,
  addMessage: (message: Message) => void
) => {
  const socket = useChatStore((state) => state.socket);

  useEffect(() => {
    if (!socket || !roomId) return;

    const handleNewMessage = (message: Message) => {
      addMessage(message);
    };

    // Join room และ listen events
    socket.emit("join_room", { roomId });
    socket.on("new_message", handleNewMessage);

    // Cleanup
    return () => {
      socket.off("new_message", handleNewMessage);
      socket.emit("leave_room", { roomId });
    };
  }, [socket, roomId, addMessage]);
};
