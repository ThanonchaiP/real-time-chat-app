import { Socket } from "socket.io-client";
import { create } from "zustand";

import { UserStatus } from "@/features/home";

interface ChatStore {
  socket: Socket | null;
  userOnline: { [key: string]: string };
  setSocket: (socket: Socket | null) => void;
  setStatusChange: (value: UserStatus) => void;
  setUserOnline: (value: Record<string, "online" | "offline">) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  userOnline: {},
  socket: null,
  setSocket: (socket) => set({ socket }),
  setStatusChange: (value) =>
    set((state) => ({
      userOnline: {
        ...state.userOnline,
        [value.userId]: value.status,
      },
    })),
  setUserOnline: (value) =>
    set((state) => ({
      userOnline: {
        ...state.userOnline,
        ...value,
      },
    })),
}));
