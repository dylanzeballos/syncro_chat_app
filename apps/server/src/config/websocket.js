import { handleConnection } from "../handlers/websocket.handler.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import logger from "../utils/logger.js";

export const setupWebSocket = (io) => {
  io.use(async (socket, next) => {
    try {
      const token =
        socket.handshake.auth.token || socket.handshake.headers.authorization;

      if (!token) {
        logger.warn("WebSocket connection attempt without token");
        return next();
      }

      const user = await verifyToken(token);
      socket.user = user;
      next();
    } catch (error) {
      logger.error("WebSocket auth error:", error.message);
      next(new Error("Authentication failed"));
    }
  });

  io.on("connection", (socket) => {
    handleConnection(io, socket);
  });

  logger.success("WebSocket server configured");
};
