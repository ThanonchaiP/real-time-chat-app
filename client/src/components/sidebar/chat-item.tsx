import { cn } from "@/lib/utils";
import { getAvatarName } from "@/utils";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  typing: boolean;
  isActive?: boolean;
  onClick?: (id: string) => void;
}

export const ChatItem = ({
  id,
  name,
  lastMessage,
  timestamp,
  typing,
  isActive = false,
  onClick,
}: Chat) => {
  return (
    <div
      className={cn(
        "flex items-center gap-4 py-[15px] px-[20px] cursor-pointer hover:bg-[#E6EBF5]",
        isActive && "bg-[#E6EBF5]"
      )}
      onClick={() => onClick?.(id)}
    >
      <div className="relative">
        <Avatar className="size-[35px]">
          <AvatarImage src="" />
          <AvatarFallback className="bg-amber-700 text-white">
            {getAvatarName(name)}
          </AvatarFallback>
        </Avatar>

        {typing && (
          <span className="absolute right-0 bottom-0 w-2.5 h-2.5 rounded-full bg-green-500 border border-white" />
        )}
      </div>
      <div className="flex flex-1 justify-between">
        <div>
          <h5 className="font-semibold">{name}</h5>
          {typing ? (
            <TypingIndicator />
          ) : (
            <p className="text-sm text-muted-foreground truncate max-w-[230px]">
              {lastMessage}
            </p>
          )}
        </div>
        <p className="text-[11px] text-muted-foreground">
          {new Date(timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
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
