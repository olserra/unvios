"use client";

import { User } from "@/lib/db/schema";
import { createContext, useContext, ReactNode, useMemo } from "react";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

type UserContextType = {
  user: User | undefined;
  isLoading: boolean;
  error: any;
  mutate: (
    data?:
      | User
      | Promise<User | undefined>
      | ((current?: User | undefined) => User | Promise<User | undefined>),
    shouldRevalidate?: boolean
  ) => Promise<User | undefined>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: Readonly<{ children: ReactNode }>) {
  const { data: user, error, isLoading, mutate } = useSWR<User>("/api/user", fetcher);

  const value = useMemo(
    () => ({ user, isLoading, error, mutate }),
    [user, isLoading, error, mutate]
  );

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
