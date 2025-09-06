import { useUser } from "@/hooks";
import { MenuKey } from "@/types";

import { SidebarChats } from "./sidebar-chats";
import { SidebarUsers } from "./sidebar-users";

interface SidebarProps {
  currentMenu: MenuKey;
  onMenuChange: (menu: MenuKey) => void;
}

export const Sidebar = ({ currentMenu, onMenuChange }: SidebarProps) => {
  const userContext = useUser();

  return (
    <div className="w-full bg-[#F5F7FB] h-screen overflow-hidden lg:w-[380px] lg:min-w-[380px]">
      {currentMenu === "users" ? (
        <SidebarUsers userId={userContext.user?._id ?? ""} />
      ) : (
        <SidebarChats
          userId={userContext.user?._id ?? ""}
          onMenuChange={onMenuChange}
        />
      )}
    </div>
  );
};
