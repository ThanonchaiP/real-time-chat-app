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
}

export const UserItem = ({ color, name, _id, isGroup }: UserItemProps) => {
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
    if (isGroup || currentRoom === cache?.[_id]) return;

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
        <Avatar className="size-[35px]">
          <AvatarImage src="" />
          <AvatarFallback
            className="text-white"
            style={{ backgroundColor: color }}
          >
            {getAvatarName(name)}
          </AvatarFallback>
        </Avatar>
      </div>

      <h3 className="text-sm font-medium">{name}</h3>
    </div>
  );
};
