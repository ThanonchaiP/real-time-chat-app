import { LogOut } from "lucide-react";

import { useLogout } from "@/features/auth";
import { useUser } from "@/hooks";
import { getAvatarName } from "@/utils";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

export const UserIcon = () => {
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
    <Popover>
      <PopoverTrigger asChild>
        <Avatar className="size-10 cursor-pointer">
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
  );
};
