import Link from "next/link";
import { useState } from "react";
import SimpleBar from "simplebar-react";

import { useListRoom, useListUser } from "@/features/home";

import { UserItem } from "./user-item";
import { SearchInput } from "../search-input";

import "simplebar/dist/simplebar.min.css";

const cache: Record<string, string> = {};

type SidebarUsersProps = {
  userId: string;
};

export const SidebarUsers = ({ userId }: SidebarUsersProps) => {
  const { data } = useListUser({ limit: 100 });
  const { data: roomData } = useListRoom({ type: "group" });

  const [search, setSearch] = useState("");

  const dataSource = (data || []).filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return (
    <div className="h-full">
      <div className="p-6 pb-2">
        <h2 className="text-xl font-semibold mb-6">Users</h2>
        <SearchInput placeholder="Search users" onChange={handleSearchChange} />
      </div>

      <h4 className="font-semibold m-6 mb-2">Groups</h4>
      {roomData?.data?.map((room) => (
        <Link key={room._id} href={`/messages/${room._id}`} className="block">
          <UserItem _id={room._id} color="skyblue" name={room.name} />
        </Link>
      ))}

      <h4 className="font-semibold m-6 mb-2">Users</h4>

      <SimpleBar style={{ maxHeight: "calc(100vh - 320px)" }} autoHide={true}>
        <ul>
          {dataSource.map((user) => {
            if (user._id === userId) return null;

            return <UserItem key={user._id} {...user} />;
          })}
        </ul>
      </SimpleBar>
    </div>
  );
};
