import { ChevronLeft } from "lucide-react";

import { getAvatarName } from "@/utils";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface MessageHeaderProps {
  name: string;
  color?: string;
  isOnline: boolean;
  onOpen: (open: boolean) => void;
}

export const MessageHeader = ({
  name,
  color = "#4A90E2",
  isOnline,
  onOpen,
}: MessageHeaderProps) => {
  return (
    <div className="flex items-center gap-3 p-4 border-b border-gray-200">
      <ChevronLeft
        className="size-5 cursor-pointer text-neutral-400 lg:hidden"
        onClick={() => onOpen(false)}
      />

      <Avatar className="relative size-[35px] overflow-visible">
        <AvatarImage src="" />
        <AvatarFallback
          className="text-white"
          style={{ backgroundColor: color }}
        >
          {getAvatarName(name)}
        </AvatarFallback>
        {isOnline && (
          <span className="absolute bottom-[1px] right-[0px] bg-green-500 border-[2px] border-white size-[10px] rounded-full"></span>
        )}
      </Avatar>

      <h3 className="text-base font-medium">{name}</h3>
    </div>
  );
};
