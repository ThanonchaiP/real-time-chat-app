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
