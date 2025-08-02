"use client";

import { use } from "react";

import { MessageContent } from "@/components/message-content";
import { MessageHeader } from "@/components/message-header";
import { MessageInput } from "@/components/message-input";
import { useGetRoom } from "@/features/home";

export default function RoomPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = use(params);

  const { data } = useGetRoom({ roomId });

  return (
    <div className="flex-1 flex flex-col h-full">
      <MessageHeader name={data?.name ?? ""} color={data?.color} />
      <MessageContent roomId={roomId} />
      <MessageInput />
    </div>
  );
}
