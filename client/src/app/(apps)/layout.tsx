"use client";

import { useState } from "react";

import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import { UserProvider } from "@/contexts/user-context";
import { MenuKey } from "@/types";

const AppsLayout = ({ children }: { children: React.ReactNode }) => {
  const [currentMenu, setCurrentMenu] = useState<MenuKey>("users");

  const handleMenuChange = (menu: MenuKey) => {
    setCurrentMenu(menu);
  };

  return (
    <UserProvider>
      <div className="h-screen flex overflow-hidden">
        <Navbar currentMenu={currentMenu} onMenuChange={handleMenuChange} />
        <Sidebar currentMenu={currentMenu} />
        {children}
      </div>
    </UserProvider>
  );
};

export default AppsLayout;
