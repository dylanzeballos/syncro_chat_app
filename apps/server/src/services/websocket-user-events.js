import { supabase } from "../config/database.js";
import { getRoomMembers } from "./room.service.js";
import logger from "../utils/logger.js";

export const setupUserStatusEvents = (io, socket) => {
  socket.on("typing-start", (roomId) => {
    socket.to(`room:${roomId}`).emit("user-typing", {
      userId: socket.user.id,
      username: socket.user.user_metadata?.full_name || socket.user.email,
      isTyping: true,
    });
  });

  socket.on("typing-stop", (roomId) => {
    socket.to(`room:${roomId}`).emit("user-typing", {
      userId: socket.user.id,
      username: socket.user.user_metadata?.full_name || socket.user.email,
      isTyping: false,
    });
  });

  socket.on("update-status", (status) => {
    socket.broadcast.emit("user-status-changed", {
      userId: socket.user.id,
      status,
      timestamp: new Date().toISOString(),
    });
  });
};

export const handleUserDisconnect = async (io, socket) => {
  logger.info(`User disconnected: ${socket.user.id}`);

  try {
    await supabase
      .from("users")
      .update({
        status: "offline",
        last_seen: new Date().toISOString(),
      })
      .eq("id", socket.user.id);
  } catch (error) {
    logger.error("Error updating user status on disconnect:", error.message);
  }

  if (socket.currentRoom) {
    const roomId = socket.currentRoom;

    try {
      const roomMembers = await getRoomMembers(roomId);
      const onlineUserIds = [];

      const socketsInRoom = await io.in(`room:${roomId}`).fetchSockets();
      socketsInRoom.forEach(s => {
        if (s.user && roomMembers.some(member => member.users.id === s.user.id)) {
          onlineUserIds.push(s.user.id);
        }
      });

      io.to(`room:${roomId}`).emit("room-members-online", { onlineUserIds });
    } catch (error) {
      logger.error("Error updating room members on disconnect:", error.message);
    }

    socket.to(`room:${roomId}`).emit("user-left", {
      userId: socket.user.id,
      username: socket.user.user_metadata?.full_name || socket.user.email,
      timestamp: new Date().toISOString(),
    });
  }

  socket.broadcast.emit("user-status-changed", {
    userId: socket.user.id,
    status: "offline",
    timestamp: new Date().toISOString(),
  });
};
