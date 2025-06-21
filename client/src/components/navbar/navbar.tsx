import { BotMessageSquareIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export const Navbar = () => {
  return (
    <div className="min-w-[75px] max-w-[75px] flex flex-col items-center justify-between border-r py-6">
      <BotMessageSquareIcon className="text-sky-600" size={38} />
      <BotMessageSquareIcon />

      <Avatar className="w-10 h-10">
        <AvatarImage src="" />
        <AvatarFallback className="bg-[#EFF1F2] font-bold">CN</AvatarFallback>
      </Avatar>
    </div>
  );
};
