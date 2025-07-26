import { getAvatarName } from "@/utils";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export const MessageHeader = () => {
  return (
    <div className="p-4 flex items-center gap-3">
      <Avatar className="size-[35px]">
        <AvatarImage src="" />
        <AvatarFallback
          className="text-white"
          style={{ backgroundColor: "#4A90E2" }} // Default color
        >
          {getAvatarName("Non")}
        </AvatarFallback>
      </Avatar>

      <h3 className="text-base font-medium">Non</h3>
    </div>
  );
};
