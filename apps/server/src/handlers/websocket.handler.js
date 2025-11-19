import logger from "../utils/logger.js";
import * as chatService from "../services/chat.service.js";
import * as websocketService from "../services/websocket.service.js";

export const handleConnection = (io, socket) => {
  const userId = socket.user?.id || socket.id;

  logger.info(`Client connected: ${socket.id} (User: ${userId})`);

  socket.join(`user:${userId}`);

  // Handle joining a chat room
  socket.on("join:room", async (data) => {
    try {
      const { roomId } = data;

      const hasAccess = await chatService.checkRoomAccess(userId, roomId);

      if (!hasAccess) {
        socket.emit("error", { message: "Access denied to room" });
        return;
      }

      socket.join(`room:${roomId}`);

      socket.to(`room:${roomId}`).emit("user:joined", {
        userId,
        roomId,
        timestamp: new Date().toISOString(),
      });

      await websocketService.updateUserStatus(userId, "online");

      logger.info(`User ${userId} joined room ${roomId}`);
    } catch (error) {
      logger.error("Error joining room:", error);
      socket.emit("error", { message: "Failed to join room" });
    }
  });

  // Handle leaving a chat room
  socket.on("leave:room", async (data) => {
    try {
      const { roomId } = data;

      socket.leave(`room:${roomId}`);

      socket.to(`room:${roomId}`).emit("user:left", {
        userId,
        roomId,
        timestamp: new Date().toISOString(),
      });

      logger.info(`User ${userId} left room ${roomId}`);
    } catch (error) {
      logger.error("Error leaving room:", error);
    }
  });

  // Handle sending a message
  socket.on("message:send", async (data) => {
    try {
      const { roomId, content, messageType = "text" } = data;

      const message = await chatService.createMessage({
        roomId,
        userId,
        content,
        messageType,
      });

      io.to(`room:${roomId}`).emit("message:new", message);

      logger.info(`Message sent in room ${roomId} by user ${userId}`);
    } catch (error) {
      logger.error("Error sending message:", error);
      socket.emit("error", { message: "Failed to send message" });
    }
  });

  socket.on("typing:start", (data) => {
    const { roomId } = data;
    socket.to(`room:${roomId}`).emit("user:typing", { userId, roomId });
  });

  socket.on("typing:stop", (data) => {
    const { roomId } = data;
    socket.to(`room:${roomId}`).emit("user:stopped-typing", { userId, roomId });
  });

  socket.on("disconnect", async () => {
    try {
      await websocketService.updateUserStatus(userId, "offline");
      logger.info(`Client disconnected: ${socket.id}`);
    } catch (error) {
      logger.error("Error on disconnect:", error);
    }
  });
};
