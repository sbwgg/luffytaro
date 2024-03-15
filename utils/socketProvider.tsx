"use client";

import React, { createContext, useContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";

interface ContextType {
  socket: any;
}

interface UserType {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  username: string;
  email: string;
  profile: string;
}

interface ConnectedType {
  socketId: string;
  userId: string;
}

const Context = createContext({} as ContextType);

export const useSocket = () => {
  return useContext(Context);
};

const SocketProvider = ({
  children,
  user,
}: {
  children: React.ReactNode;
  user: UserType | null;
}) => {
  const socket = useRef<any>(null);

  useEffect(() => {
    socket.current = io(process.env.NEXT_PUBLIC_SOCKET_URL!);
  }, []);

  useEffect(() => {
    socket.current.emit("sendUser", user?.id);

    socket.current.on("getUser", (users: ConnectedType[]) => {});
  }, [user?.id]);

  return <Context.Provider value={{ socket }}>{children}</Context.Provider>;
};

export default SocketProvider;
