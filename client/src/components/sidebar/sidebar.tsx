import { MenuKey } from "@/types";

import { SidebarChats } from "./sidebar-chats";
import { SidebarUsers } from "./sidebar-users";

interface SidebarProps {
  currentMenu: MenuKey;
}

export const Sidebar = ({ currentMenu }: SidebarProps) => {
  return (
    <div className="w-[380px] min-w-[380px]">
      {currentMenu === "users" ? <SidebarUsers /> : <SidebarChats />}
    </div>
  );
};
