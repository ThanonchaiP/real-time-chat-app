"use client";

import { MessageContent } from "@/components/message-content";
import { MessageHeader } from "@/components/message-header";
import { MessageInput } from "@/components/message-input";

export default function RoomPage() {
  return (
    <div className="flex-1 flex flex-col h-full">
      <MessageHeader />
      <MessageContent />
      <MessageInput />
    </div>
  );
}
