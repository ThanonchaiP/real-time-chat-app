"use client";

import { useState } from "react";

import { Navbar } from "@/components/navbar";
import { MenuKey } from "@/types";

const AppsLayout = ({ children }: { children: React.ReactNode }) => {
  const [currentMenu, setCurrentMenu] = useState<MenuKey>("users");

  const handleMenuChange = (menu: MenuKey) => {
    setCurrentMenu(menu);
  };

  return (
    <div className="min-h-screen flex">
      <Navbar currentMenu={currentMenu} onMenuChange={handleMenuChange} />
      <div>Sidebar</div>
      {children}
    </div>
  );
};

export default AppsLayout;
