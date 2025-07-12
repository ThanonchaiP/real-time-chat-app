"use client";

import {
  BotMessageSquareIcon,
  LogOut,
  MessageSquareMore,
  UserRound,
} from "lucide-react";

import { useLogout } from "@/features/auth";
import { useUser } from "@/hooks";
import { cn } from "@/lib/utils";
import { MenuKey } from "@/types";
import { getAvatarName } from "@/utils";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

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
  const userContext = useUser();

  const { user } = userContext;

  const { mutate } = useLogout({
    onSuccess: () => {
      window.location.href = "/login";
    },
  });

  const onLogout = () => {
    mutate();
    userContext.logout();
  };

  return (
    <div className="min-w-[75px] max-w-[75px] flex flex-col items-center justify-between border-r py-6">
      <div className="flex flex-col items-center">
        <BotMessageSquareIcon className="text-sky-600" size={38} />

        <div className="flex flex-col gap-6 mt-24">
          {navigations.map((nav) => (
            <Tooltip key={nav.id} delayDuration={200} disableHoverableContent>
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

      <Popover>
        <PopoverTrigger asChild>
          <Avatar className="w-10 h-10 cursor-pointer">
            <AvatarImage src="" />
            <AvatarFallback
              className="font-bold text-white"
              style={{ backgroundColor: user?.color }}
            >
              {getAvatarName(user?.name)}
            </AvatarFallback>
          </Avatar>
        </PopoverTrigger>
        <PopoverContent
          className="w-48 text-center"
          side="right"
          align="end"
          sideOffset={8}
        >
          <p className="text-sm text-muted-foreground truncate mb-2">
            Signed in as
          </p>
          <p className="font-medium">{user?.name || "Anonymous"}</p>
          <Button
            variant="destructive"
            size="sm"
            className="mt-4 w-full"
            onClick={onLogout}
          >
            <LogOut className="mr-1" size={16} />
            Log out
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  );
};
