import { Server } from "socket.io";
import { verifySupabaseToken } from "../services/auth.service.js";
import { setupRoomEvents } from "../services/websocket-room-events.js";
import { setupMessageEvents } from "../services/websocket-message-events.js";
import { setupUserStatusEvents, handleUserDisconnect } from "../services/websocket-user-events.js";
import logger from "../utils/logger.js";

export const initializeWebSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      credentials: true,
    },
  });

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        throw new Error("No token provided");
      }

      const user = await verifySupabaseToken(token.replace("Bearer ", ""));
      socket.user = user;
      next();
    } catch (error) {
      logger.error("Socket authentication failed:", error.message);
      next(new Error("Authentication failed"));
    }
  });

  io.on("connection", async (socket) => {
    logger.info(`WebSocket connected: ${socket.user.id} (${socket.user.email})`);

    socket.join(`user:${socket.user.id}`);

    setupRoomEvents(io, socket);
    setupMessageEvents(io, socket);
    setupUserStatusEvents(io, socket);

    socket.on("error", (error) => {
      logger.error(`Socket error from user ${socket.user.id}:`, error);
    });

    socket.on("disconnect", async () => {
      await handleUserDisconnect(io, socket);
    });
  });

  logger.success("WebSocket server initialized with authentication");
  return io;
};
