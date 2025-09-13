"use client";

import { createContext, ReactNode, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useShallow } from "zustand/react/shallow";

import { useGetMe, User } from "@/features/auth";
import { useChatStore } from "@/stores/user-store";

type UserContext = {
  user: User | null;
  setUser: (user: User) => void;
  logout: () => void;
};

export const UserContext = createContext<UserContext | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const { data, isLoading } = useGetMe();
  const { socket, setSocket } = useChatStore(
    useShallow((s) => ({
      socket: s.socket,
      setSocket: s.setSocket,
    }))
  );

  const [user, setUser] = useState<User | null>(null);

  const logout = () => {
    setUser(null);
    setSocket(null);
    socket?.disconnect();
  };

  useEffect(() => {
    if (!data) return;

    const socketInstance: Socket = io("wss://api.14again.life", {
      transports: ["websocket", "polling"],
      withCredentials: true,
      auth: { userId: data._id },
    });

    setUser(data);
    setSocket(socketInstance);
  }, [data, setSocket]);

  if (isLoading) return <Loader />;

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

const Loader = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="loader" />
    </div>
  );
};
