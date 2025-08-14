import { useMemo } from "react";

import { Room } from "@/features/home";
import { useChatStore } from "@/stores/user-store";

export const useUserStatus = (room?: Room, userId?: string) => {
  const userOnline = useChatStore((state) => state.userOnline);

  return useMemo(() => {
    if (!room || !userId) return "offline";

    if (room.type === "group") return "offline";

    const otherUserId =
      room.participants.find(
        (participantId: string) => participantId !== userId
      ) ?? "";

    return userOnline?.[otherUserId] ?? "offline";
  }, [room, userId, userOnline]);
};
