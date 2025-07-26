import { useParams, useRouter } from "next/navigation";
import SimpleBar from "simplebar-react";

import { useListRecent } from "@/features/home";

import { SearchInput } from "../search-input";

import { ChatItem } from "./chat-item";
import { ChatSkeleton } from "./chat-skeleton";

import "simplebar/dist/simplebar.min.css";

type SidebarChatsProps = {
  userId: string;
};

export const SidebarChats = ({ userId }: SidebarChatsProps) => {
  const router = useRouter();
  const params = useParams();

  const { data, isLoading } = useListRecent({ userId });

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

        {data?.map((room) => (
          <ChatItem
            typing={true}
            data={room}
            key={room._id}
            onClick={handleChatClick}
            isActive={roomId === room._id}
          />
        ))}
      </SimpleBar>
    </div>
  );
};
