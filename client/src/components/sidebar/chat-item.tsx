import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { RoomRecent } from "@/features/home/types";
import { cn } from "@/lib/utils";
import { getAvatarName } from "@/utils";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

dayjs.extend(relativeTime);

interface Chat {
  data: RoomRecent;
  typing: boolean;
  isActive?: boolean;
  onClick?: (id: string) => void;
}

export const ChatItem = ({ data, typing, isActive = false, onClick }: Chat) => {
  return (
    <div
      className={cn(
        "flex items-center gap-4 py-[15px] px-[20px] cursor-pointer hover:bg-[#E6EBF5]",
        isActive && "bg-[#E6EBF5]"
      )}
      onClick={() => onClick?.(data._id)}
    >
      <div className="relative">
        <Avatar className="size-[35px]">
          <AvatarImage src="" />
          <AvatarFallback className="bg-amber-700 text-white">
            {getAvatarName(data.name)}
          </AvatarFallback>
        </Avatar>

        {typing && (
          <span className="absolute right-0 bottom-0 w-2.5 h-2.5 rounded-full bg-green-500 border border-white" />
        )}
      </div>
      <div className="flex flex-1 justify-between">
        <div>
          <h5 className="font-semibold">{data.name}</h5>
          {typing ? (
            <TypingIndicator />
          ) : (
            <p className="text-sm text-muted-foreground truncate max-w-[230px]">
              {data.lastMessage.content}
            </p>
          )}
        </div>
        <p className="text-[11px] text-muted-foreground">
          {dayjs(data.lastMessage.createdAt).fromNow()}
        </p>
      </div>
    </div>
  );
};

const TypingIndicator = () => (
  <p className="text-sm text-primary font-semibold flex gap-1 items-center max-h-[20px]">
    Typing
    <span className="text-2xl animate-bounce [animation-delay:0ms]">.</span>
    <span className="text-2xl animate-bounce [animation-delay:150ms]">.</span>
    <span className="text-2xl animate-bounce [animation-delay:300ms]">.</span>
  </p>
);
