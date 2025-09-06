"use client";

import { useEffect, useState } from "react";

import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import { UserProvider } from "@/contexts/user-context";
import { useListOnlineUser, UserStatus } from "@/features/home";
import { useChatStore } from "@/stores/user-store";
import { MenuKey } from "@/types";

const AppsLayout = ({ children }: { children: React.ReactNode }) => {
  const [currentMenu, setCurrentMenu] = useState<MenuKey>("users");

  const { socket, setStatusChange, setUserOnline } = useChatStore();

  const onlineUsers = useListOnlineUser();

  const handleMenuChange = (menu: MenuKey) => {
    setCurrentMenu(menu);
  };

  useEffect(() => {
    if (!onlineUsers.data) return;
    setUserOnline(onlineUsers.data);
  }, [onlineUsers.data, setUserOnline]);

  useEffect(() => {
    if (!socket) return;

    const handleStatusChange = (value: UserStatus) => {
      setStatusChange(value);
    };

    socket.on("user_status_change", handleStatusChange);

    return () => {
      socket.off("user_status_change", handleStatusChange);
    };
  }, [socket, setStatusChange]);

  return (
    <UserProvider>
      <div className="h-[calc(100vh-58px)] overflow-hidden lg:h-screen flex">
        <Navbar currentMenu={currentMenu} onMenuChange={handleMenuChange} />
        <Sidebar currentMenu={currentMenu} onMenuChange={handleMenuChange} />
        {children}
      </div>
    </UserProvider>
  );
};

export default AppsLayout;
