import { ImageIcon, Send, Smile } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { useUser } from "@/hooks";

import { Button } from "../ui/button";
import { LoadingSpinner } from "../ui/spinner";

interface MessageInputProps {
  roomId: string;
}

export const MessageInput = ({ roomId }: MessageInputProps) => {
  const { socket, user } = useUser();

  const isTypingRef = useRef(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !socket || isSending) return;

    const senderId = user?._id || "";

    try {
      setIsSending(true);

      if (isTypingRef.current) {
        socket.emit("typing_end", { roomId, userId: senderId });
        isTypingRef.current = false;
      }

      const messagePromise = new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error("Message send timeout"));
        }, 5000);

        socket.once("message_sent", () => {
          clearTimeout(timeout);
          resolve(true);
        });

        socket.once("error", (error: unknown) => {
          clearTimeout(timeout);
          reject(error);
        });
      });

      socket.emit("new_message", {
        roomId,
        content: newMessage.trim(),
        senderId,
      });

      await messagePromise;
      setNewMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewMessage(value);

    if (!isTypingRef.current && value.trim()) {
      socket?.emit("typing_start", { roomId, userId: user?._id });
      isTypingRef.current = true;
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      if (isTypingRef.current) {
        socket?.emit("typing_end", { roomId, userId: user?._id });
        isTypingRef.current = false;
      }
    }, 2000);
  };

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      if (isTypingRef.current)
        socket?.emit("typing_end", { roomId, userId: user?._id });
    };
  }, [socket, roomId, user?._id]);

  return (
    <div className="bg-white border-t border-gray-200 px-4 py-3">
      <div className="flex items-center space-x-4">
        <input
          type="text"
          value={newMessage}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          placeholder="Enter Message..."
          className="flex-1 p-3 bg-[#E6EBF5] rounded-lg text-sm focus-visible:outline-0"
        />

        <Smile className="w-5 h-5 text-blue-500 cursor-pointer" />
        <ImageIcon className="w-5 h-5 text-blue-500 cursor-pointer" />

        <Button
          onClick={sendMessage}
          disabled={!newMessage.trim() || isSending}
          className="bg-blue-500 text-white hover:bg-sky-700"
        >
          {isSending ? (
            <LoadingSpinner className="w-5 h-5" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </Button>
      </div>
    </div>
  );
};
