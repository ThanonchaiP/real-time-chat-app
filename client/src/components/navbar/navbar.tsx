"use client";

import { BotMessageSquareIcon, LogOut } from "lucide-react";

import { useLogout } from "@/features/auth";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export const Navbar = () => {
  const logout = useLogout({
    onSuccess: () => {
      window.location.href = "/login";
    },
  });

  const onLogout = () => {
    logout.mutate();
  };

  return (
    <div className="min-w-[75px] max-w-[75px] flex flex-col items-center justify-between border-r py-6">
      <BotMessageSquareIcon className="text-sky-600" size={38} />
      <BotMessageSquareIcon />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="w-10 h-10 cursor-pointer">
            <AvatarImage src="" />
            <AvatarFallback className="bg-[#EFF1F2] font-bold">
              CN
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-20" align="start">
          <DropdownMenuItem className="cursor-pointer" onClick={onLogout}>
            Log out
            <DropdownMenuShortcut>
              <LogOut />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
