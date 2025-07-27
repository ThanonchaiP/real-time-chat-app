import { Image, Send, Smile } from "lucide-react";
import { useState } from "react";

import { Button } from "../ui/button";

export const MessageInput = () => {
  const [newMessage, setNewMessage] = useState("");

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    console.log("Sending message:", newMessage);
  };

  return (
    <div className="bg-white border-t border-gray-200 px-4 py-3">
      <div className="flex items-center space-x-4">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Enter Message..."
          className="flex-1 p-3 bg-[#E6EBF5] rounded-lg text-sm focus-visible:outline-0"
        />

        <Smile className="w-5 h-5 text-blue-500 cursor-pointer" />
        <Image className="w-5 h-5 text-blue-500 cursor-pointer" />

        <Button
          onClick={sendMessage}
          disabled={!newMessage.trim()}
          className="bg-blue-500 text-white hover:bg-sky-700"
        >
          <Send className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};
