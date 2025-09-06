"use client";

import {
  BotMessageSquareIcon,
  MessageSquareMore,
  UserRound,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { MenuKey } from "@/types";

import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

import { UserIcon } from "./user-icon";

interface NavbarProps {
  currentMenu?: MenuKey;
  onMenuChange?: (menu: MenuKey) => void;
}

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

export const Navbar = ({ currentMenu, onMenuChange }: NavbarProps) => {
  return (
    <div
      className={cn(
        "min-w-[75px] w-full flex items-center justify-center gap-10 lg:justify-between border-r py-1 lg:py-6 lg:max-w-[75px] lg:flex-col lg:gap-0",
        "fixed bottom-0 left-0 bg-white border border-t-gray-100 shadow lg:static lg:border-0 lg:shadow-none"
      )}
    >
      <div className="flex flex-col items-center">
        <BotMessageSquareIcon
          className="hidden text-blue-500 lg:block"
          size={38}
        />

        <div className="flex gap-10 lg:gap-6 lg:flex-col lg:mt-24">
          {navigations.map((nav) => (
            <Tooltip key={nav.id} delayDuration={200} disableHoverableContent>
              <TooltipTrigger asChild>
                <button
                  className={cn(
                    "size-12 flex items-center justify-center rounded cursor-pointer text-gray-500 hover:text-blue-500 lg:size-14",
                    currentMenu === nav.id && "bg-sky-50 text-blue-500"
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

      <UserIcon />
    </div>
  );
};
