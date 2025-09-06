import Link from "next/link";
import { useState } from "react";
import SimpleBar from "simplebar-react";

import { useListRoom, useListUser } from "@/features/home";
import { useChatStore } from "@/stores/user-store";

import { SearchInput } from "../search-input";

import { ChatSkeleton } from "./chat-skeleton";
import { UserItem } from "./user-item";

import "simplebar/dist/simplebar.min.css";

type SidebarUsersProps = {
  userId: string;
};

export const SidebarUsers = ({ userId }: SidebarUsersProps) => {
  const { data, isLoading } = useListUser({ limit: 100 });
  const { data: roomData, isLoading: isLoadingRooms } = useListRoom({
    type: "group",
  });

  const userOnline = useChatStore((state) => state.userOnline);

  const [search, setSearch] = useState("");

  const dataSource = (data || []).filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return (
    <div className="h-[calc(100vh-58px)] lg:h-full">
      <div className="p-6 pb-2">
        <h2 className="text-xl font-semibold mb-6">Users</h2>
        <SearchInput placeholder="Search users" onChange={handleSearchChange} />
      </div>

      <h4 className="font-semibold m-6 mb-2">Groups</h4>
      {isLoadingRooms && <ChatSkeleton />}
      {roomData?.data?.map((room) => (
        <Link key={room._id} href={`/messages/${room._id}`} className="block">
          <UserItem _id={room._id} color="#4A90E2" name={room.name} isGroup />
        </Link>
      ))}

      <h4 className="font-semibold m-6 mb-2">Users</h4>

      <SimpleBar style={{ maxHeight: "calc(100vh - 320px)" }} autoHide={true}>
        {isLoading &&
          Array.from({ length: 10 }).map((_, index) => (
            <ChatSkeleton key={index} isRecent />
          ))}
        <ul>
          {dataSource.map((user) => {
            if (user._id === userId) return null;

            return (
              <UserItem
                {...user}
                key={user._id}
                isOnline={userOnline?.[user._id] === "online"}
              />
            );
          })}
        </ul>
      </SimpleBar>
    </div>
  );
};
