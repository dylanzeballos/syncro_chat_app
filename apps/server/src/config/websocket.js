import { Server } from "socket.io";
import logger from "../utils/logger.js";

export const initializeWebSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    logger.info(`Client connected: ${socket.id}`);

    socket.on("disconnect", () => {
      logger.info(`Client disconnected: ${socket.id}`);
    });

    socket.on("error", (error) => {
      logger.error("Socket error:", error);
    });
  });

  logger.success("WebSocket server initialized");
  return io;
};
