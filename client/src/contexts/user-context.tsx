"use client";

import { createContext, ReactNode, useEffect, useState } from "react";

import { useGetMe, User } from "@/features/auth";

type UserContext = {
  user: User | null;
  setUser: (user: User) => void;
  logout: () => void;
};

export const UserContext = createContext<UserContext | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const { data, isLoading } = useGetMe();

  const [user, setUser] = useState<User | null>(null);

  const logout = () => {
    setUser(null);
  };

  useEffect(() => {
    if (!data) return;

    setUser(data);
  }, [data]);

  if (isLoading) {
    return <div>Loading...</div>; // You can replace this with a loading spinner or skeleton
  }

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};
