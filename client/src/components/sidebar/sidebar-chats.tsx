import { useParams, useRouter } from "next/navigation";
import SimpleBar from "simplebar-react";

import { useListRecent } from "@/features/home";

import { SearchInput } from "../search-input";

import { ChatItem } from "./chat-item";

import "simplebar/dist/simplebar.min.css";

const chats = Array.from({ length: 20 }, (_, i) => ({
  id: `${i + 1}`,
  name: `Chat ${i + 1}`,
  lastMessage: `Last message in chat ${i + 1}`,
  timestamp: new Date().toISOString(),
  typing: Math.random() < 0.5,
}));

type SidebarChatsProps = {
  userId: string;
};

export const SidebarChats = ({ userId }: SidebarChatsProps) => {
  const router = useRouter();
  const params = useParams();

  const { data } = useListRecent({
    userId,
  });

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
        {chats.map((chat) => (
          <ChatItem
            {...chat}
            key={chat.id}
            onClick={handleChatClick}
            isActive={roomId === chat.id}
          />
        ))}
      </SimpleBar>
    </div>
  );
};
