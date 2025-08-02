import { getAvatarName } from "@/utils";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface MessageHeaderProps {
  name: string;
  color?: string;
}

export const MessageHeader = ({
  name,
  color = "#4A90E2",
}: MessageHeaderProps) => {
  return (
    <div className="p-4 flex items-center gap-3 border-b border-gray-200">
      <Avatar className="size-[35px]">
        <AvatarImage src="" />
        <AvatarFallback
          className="text-white"
          style={{ backgroundColor: color }}
        >
          {getAvatarName(name)}
        </AvatarFallback>
      </Avatar>

      <h3 className="text-base font-medium">{name}</h3>
    </div>
  );
};
