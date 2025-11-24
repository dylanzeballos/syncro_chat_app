import { checkRoomAccess, getRoomMembers } from "./room.service.js";
import logger from "../utils/logger.js";

export const setupRoomEvents = (io, socket) => {
  socket.on("join-room", async (roomId) => {
    try {
      const hasAccess = await checkRoomAccess(socket.user.id, roomId);
      if (!hasAccess) {
        socket.emit("error", { message: "Access denied to this room" });
        return;
      }

      socket.join(`room:${roomId}`);
      socket.currentRoom = roomId;

      const roomMembers = await getRoomMembers(roomId);
      const onlineUserIds = [];

      const socketsInRoom = await io.in(`room:${roomId}`).fetchSockets();
      socketsInRoom.forEach(s => {
        if (s.user && roomMembers.some(member => member.users.id === s.user.id)) {
          onlineUserIds.push(s.user.id);
        }
      });

      if (!onlineUserIds.includes(socket.user.id)) {
        onlineUserIds.push(socket.user.id);
      }

      io.to(`room:${roomId}`).emit("room-members-online", { onlineUserIds });

      socket.to(`room:${roomId}`).emit("user-joined", {
        userId: socket.user.id,
        username: socket.user.user_metadata?.full_name || socket.user.email,
        timestamp: new Date().toISOString(),
      });

      logger.info(`User ${socket.user.id} joined room ${roomId}`);
    } catch (error) {
      logger.error("Error joining room:", error.message);
      socket.emit("error", { message: "Failed to join room" });
    }
  });

  socket.on("leave-room", (roomId) => {
    socket.leave(`room:${roomId}`);
    socket.to(`room:${roomId}`).emit("user-left", {
      userId: socket.user.id,
      username: socket.user.user_metadata?.full_name || socket.user.email,
      timestamp: new Date().toISOString(),
    });

    if (socket.currentRoom === roomId) {
      socket.currentRoom = null;
    }

    logger.info(`User ${socket.user.id} left room ${roomId}`);
  });
};
