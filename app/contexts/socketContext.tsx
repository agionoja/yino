import { ReactNode, createContext, useContext } from "react";
import { Socket } from "socket.io-client";

type ProviderProps = {
  socket: Socket | undefined;
  children: ReactNode;
};

const context = createContext<Socket | undefined>(undefined);

export function useSocket() {
  return useContext(context);
}

export function SocketProvider({ children, socket }: ProviderProps) {
  return <context.Provider value={socket}>{children}</context.Provider>;
}
