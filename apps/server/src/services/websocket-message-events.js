import { createMessage } from "./message.service.js";
import { checkRoomAccess } from "./room.service.js";
import logger from "../utils/logger.js";

export const setupMessageEvents = (io, socket) => {
  socket.on("send-message", async (data) => {
    try {
      const { roomId, content, messageType = "text" } = data;

      if (!roomId || !content) {
        socket.emit("error", { message: "Missing required fields" });
        return;
      }

      const hasAccess = await checkRoomAccess(socket.user.id, roomId);
      if (!hasAccess) {
        socket.emit("error", { message: "Access denied to this room" });
        return;
      }

      const message = await createMessage({
        roomId,
        userId: socket.user.id,
        content,
        messageType,
      });

      const messageData = {
        id: message.id,
        content: message.content,
        messageType: message.message_type,
        timestamp: message.created_at,
        user: {
          id: message.users?.id || socket.user.id,
          username: message.users?.username || socket.user.user_metadata?.full_name || socket.user.email,
          avatarUrl: message.users?.avatar_url || socket.user.user_metadata?.avatar_url,
        },
        roomId: message.room_id,
      };

      io.to(`room:${roomId}`).emit("new-message", messageData);

      logger.info(`Message sent in room ${roomId} by user ${socket.user.id}`);
    } catch (error) {
      logger.error("Error sending message:", error.message);
      socket.emit("error", { message: "Failed to send message" });
    }
  });

  socket.on("mark-as-read", async (data) => {
    try {
      const { roomId, messageId } = data;

      socket.to(`room:${roomId}`).emit("message-read", {
        messageId,
        readBy: socket.user.id,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error("Error marking message as read:", error.message);
    }
  });
};
