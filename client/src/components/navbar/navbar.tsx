"use client";

import {
  BotMessageSquareIcon,
  LogOut,
  MessageSquareMore,
  UserRound,
} from "lucide-react";

import { useLogout } from "@/features/auth";
import { cn } from "@/lib/utils";
import { MenuKey } from "@/types";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

interface NavbarProps {
  currentMenu?: MenuKey;
  onMenuChange?: (menu: MenuKey) => void;
}

export const Navbar = ({ currentMenu, onMenuChange }: NavbarProps) => {
  const navigations = [
    {
      id: "users" as MenuKey,
      name: "Users",
      icons: <UserRound size={24} />,
    },
    {
      id: "chats" as MenuKey,
      name: "Chats",
      icons: <MessageSquareMore size={24} />,
    },
  ];

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
      <div className="flex flex-col items-center">
        <BotMessageSquareIcon className="text-sky-600" size={38} />

        <div className="flex flex-col gap-6 mt-24">
          {navigations.map((nav) => (
            <Tooltip key={nav.id}>
              <TooltipTrigger asChild>
                <button
                  className={cn(
                    "size-14 flex items-center justify-center rounded cursor-pointer text-gray-500 hover:text-sky-600",
                    currentMenu === nav.id && "bg-sky-50 text-sky-600"
                  )}
                  aria-label={nav.name}
                  onClick={() => onMenuChange?.(nav.id)}
                >
                  {nav.icons}
                </button>
              </TooltipTrigger>
              <TooltipContent
                className="bg-black text-white text-sm"
                arrowClassName="fill-black bg-black"
              >
                {nav.name}
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>

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
