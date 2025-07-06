import { useUser } from "@/hooks";
import { MenuKey } from "@/types";

import { SidebarChats } from "./sidebar-chats";
import { SidebarUsers } from "./sidebar-users";

interface SidebarProps {
  currentMenu: MenuKey;
}

export const Sidebar = ({ currentMenu }: SidebarProps) => {
  const userContext = useUser();

  return (
    <div className="w-[380px] min-w-[380px] bg-[#F5F7FB] h-screen overflow-hidden">
      {currentMenu === "users" ? (
        <SidebarUsers userId={userContext.user?._id ?? ""} />
      ) : (
        <SidebarChats userId={userContext.user?._id ?? ""} />
      )}
    </div>
  );
};
