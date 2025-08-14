import { useParams, useRouter } from "next/navigation";

import { useGetRoomByUser } from "@/features/home";
import { getAvatarName } from "@/utils";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const cache: Record<string, string> = {};

interface UserItemProps {
  color: string;
  name: string;
  _id: string;
  isGroup?: boolean;
  isOnline?: boolean;
}

export const UserItem = ({
  color,
  name,
  _id,
  isGroup = false,
  isOnline = false,
}: UserItemProps) => {
  const router = useRouter();
  const params = useParams();
  const currentRoom = params.roomId as string;

  const { mutate } = useGetRoomByUser({
    userId: _id,
    onSuccess: (roomId) => {
      cache[_id] = roomId;
      router.push(`/messages/${roomId}`);
    },
  });

  const handleUserClick = () => {
    if (
      isGroup ||
      (currentRoom === cache?.[_id] && currentRoom !== undefined)
    ) {
      return;
    }

    if (cache[_id]) {
      router.push(`/messages/${cache[_id]}`);
      return;
    }

    mutate();
  };

  return (
    <div
      className="py-[15px] px-[20px] flex items-center gap-4 hover:bg-[#E6EBF5] cursor-pointer"
      onClick={handleUserClick}
    >
      <div className="relative">
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
      </div>

      <h3 className="text-sm font-medium">{name}</h3>
    </div>
  );
};
