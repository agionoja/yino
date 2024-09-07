import { Server } from "socket.io";
import appConfig from "../app.config.js";

const socket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: appConfig.corsOrigin,
    },
  });

  io.on("connection", (socket) => {
    // from this point you are on the WS connection with a specific client
    console.log(socket.id, "connected");

    // Upon connection - only to user
    socket.emit("message", "Welcome to Chat App!");

    // Upon connection - to all others
    socket.broadcast.emit(
      "message",
      `${socket.id.substring(0, 5)} is connected`,
    );

    // listening for a message event
    socket.on("message", (message) => {
      console.log("data from client:", { message });
      io.emit("message", message);
    });

    socket.on("disconnect", () => {
      socket.broadcast.emit(
        "message",
        `User ${socket.id.substring(0, 5)} disconnected`,
      );
    });

    // Listen for activity
    socket.on("activity", (name) => {
      socket.broadcast.emit("activity", name);
    });
  });
};

export default socket;
