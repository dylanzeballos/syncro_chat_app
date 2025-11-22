import * as chatService from "../services/chat.service.js";
import logger from "../utils/logger.js";

export const getRooms = async (req, res) => {
  try {
    const userId = req.user.id;
    const rooms = await chatService.getRooms(userId);
    res.json(rooms);
  } catch (error) {
    logger.error("Error fetching rooms:", error.message);
    res.status(500).json({ message: "Failed to fetch rooms" });
  }
};

export const createRoom = async (req, res) => {
  try {
    const { name, description, isPrivate } = req.body;
    const createdBy = req.user.id;

    if (!name?.trim()) {
      return res.status(400).json({ message: "Room name is required" });
    }

    const room = await chatService.createRoom({
      name: name.trim(),
      description: description?.trim(),
      isPrivate: Boolean(isPrivate),
      createdBy,
    });

    logger.info(`Room created: ${room.id} by user ${createdBy}`);
    res.status(201).json(room);
  } catch (error) {
    logger.error("Error creating room:", error.message);
    res.status(500).json({ message: "Failed to create room" });
  }
};

export const joinRoom = async (req, res) => {
  try {
    const { code } = req.params;
    const userId = req.user.id;

    if (!code || code.length !== 10) {
      return res.status(400).json({ message: "Invalid room code" });
    }

    const room = await chatService.joinRoomByCode(code, userId);

    logger.info(`User ${userId} joined room ${room.id} via code ${code}`);
    res.json(room);
  } catch (error) {
    logger.error("Error joining room:", error.message);
    if (error.message === "Room not found") {
      res.status(404).json({ message: "Room not found" });
    } else if (error.message === "Already a member") {
      res.status(409).json({ message: "You are already a member of this room" });
    } else {
      res.status(500).json({ message: "Failed to join room" });
    }
  }
};

export const getRoomMessages = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { limit = 50, offset = 0 } = req.query;
    const userId = req.user.id;

    const hasAccess = await chatService.checkRoomAccess(userId, roomId);
    if (!hasAccess) {
      return res.status(403).json({ message: "Access denied to this room" });
    }

    const messages = await chatService.getMessages(roomId, parseInt(limit), parseInt(offset));
    res.json(messages);
  } catch (error) {
    logger.error("Error fetching messages:", error.message);
    res.status(500).json({ message: "Failed to fetch messages" });
  }
};

export const getRoomMembers = async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.user.id;

    const hasAccess = await chatService.checkRoomAccess(userId, roomId);
    if (!hasAccess) {
      return res.status(403).json({ message: "Access denied to this room" });
    }

    const members = await chatService.getRoomMembers(roomId);
    res.json(members);
  } catch (error) {
    logger.error("Error fetching room members:", error.message);
    res.status(500).json({ message: "Failed to fetch room members" });
  }
};
