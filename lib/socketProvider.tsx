"use client";

import React, { createContext, useContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";

interface ContextType {
  socket: any;
}

const Context = createContext({} as ContextType);

export const useSocket = () => {
  return useContext(Context);
};

const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const socket = useRef<any>(null);

  useEffect(() => {
    socket.current = io(`ws://localhost:8080`);
  }, [socket]);

  return <Context.Provider value={{ socket }}>{children}</Context.Provider>;
};

export default SocketProvider;
