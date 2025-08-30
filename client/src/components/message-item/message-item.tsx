import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";
import { Check, CheckCheck } from "lucide-react";
import { memo } from "react";

import { Message } from "@/features/home/types";
import { cn } from "@/lib/utils";
import { getAvatarName } from "@/utils";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

dayjs.extend(relativeTime);

interface MessageItemProps {
  userId: string;
  message: Message;
}

export const MessageItem = memo(({ message, userId }: MessageItemProps) => {
  const isOwner = message.sender._id === userId;

  const readByOthers =
    message.readBy?.filter((read) => read.userId !== userId) || [];
  const isRead = readByOthers.length > 0;

  const AvatarNode = (
    <Avatar className={cn("size-[35px]", isOwner ? "order-2" : "order-1")}>
      <AvatarImage src="" />
      <AvatarFallback
        className="text-white"
        style={{ backgroundColor: message.sender.color }}
      >
        {getAvatarName(message.sender.name)}
      </AvatarFallback>
    </Avatar>
  );

  return (
    <div
      className={cn(
        "flex items-end gap-2 py-2",
        isOwner ? "justify-end" : "justify-start"
      )}
    >
      {!isOwner ? (
        <Tooltip>
          <TooltipTrigger asChild>{AvatarNode}</TooltipTrigger>
          <TooltipContent
            side="left"
            align="center"
            sideOffset={8}
            className="bg-black text-white text-sm"
            arrowClassName="fill-black bg-black"
          >
            <p>{message.sender.name}</p>
          </TooltipContent>
        </Tooltip>
      ) : (
        AvatarNode
      )}

      <div
        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
          isOwner
            ? "bg-blue-500 text-white order-1"
            : "bg-[#F5F7FB] text-gray-800 order-2"
        }`}
      >
        <p className="text-base">{message.content}</p>
        <div className="flex items-center gap-1 mt-1">
          <span
            className={cn(
              "text-xs",
              isOwner ? "text-blue-100" : "text-gray-500"
            )}
          >
            {dayjs(message.createdAt).format("HH:mm")}
          </span>

          {isOwner && (
            <div className="flex items-center">
              {isRead ? (
                <CheckCheck
                  size={14}
                  className={cn(
                    "ml-1",
                    isOwner ? "text-blue-200" : "text-gray-400"
                  )}
                />
              ) : (
                <Check
                  size={14}
                  className={cn(
                    "ml-1",
                    isOwner ? "text-blue-200" : "text-gray-400"
                  )}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

MessageItem.displayName = "MessageItem";
