import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

export default function useSocketIo() {
  const [socket, setSocket] = useState<Socket>();

  useEffect(() => {
    const socket = io("http://localhost:3000");
    setSocket(socket);

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on("message", (data) => {
      console.log({ data });
    });
  }, [socket]);

  return { socket };
}
