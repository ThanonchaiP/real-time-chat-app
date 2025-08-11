"use client";

import { createContext, ReactNode, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

import { useGetMe, User } from "@/features/auth";

type UserContext = {
  user: User | null;
  socket: Socket | null;
  setUser: (user: User) => void;
  logout: () => void;
};

export const UserContext = createContext<UserContext | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const { data, isLoading } = useGetMe();

  const [user, setUser] = useState<User | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);

  const logout = () => {
    setUser(null);
    setSocket(null);
    socket?.disconnect();
  };

  useEffect(() => {
    if (!data) return;

    const socketInstance: Socket = io(process.env.NEXT_PUBLIC_SERVER_URL, {
      transports: ["websocket"],
      withCredentials: true,
      auth: { userId: data._id },
    });

    setUser(data);
    setSocket(socketInstance);
  }, [data]);

  if (isLoading) return <Loader />;

  return (
    <UserContext.Provider value={{ user, socket, setUser, logout }}>
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
