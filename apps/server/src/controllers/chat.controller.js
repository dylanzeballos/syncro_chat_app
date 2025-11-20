import * as chatService from "../services/chat.service.js";

export const getUserRooms = async (req, res) => {
  try {
    const rooms = await chatService.getRooms(req.user.id);
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getRoomMessages = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { limit = 50, offset = 0 } = req.query;

    const hasAccess = await chatService.checkRoomAccess(req.user.id, roomId);
    if (!hasAccess) {
      return res.status(403).json({ error: "Access denied" });
    }

    const messages = await chatService.getMessages(
      roomId,
      parseInt(limit),
      parseInt(offset)
    );
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getRoomMembers = async (req, res) => {
  try {
    const { roomId } = req.params;

    const hasAccess = await chatService.checkRoomAccess(req.user.id, roomId);
    if (!hasAccess) {
      return res.status(403).json({ error: "Access denied" });
    }

    const members = await chatService.getRoomMembers(roomId);
    res.json(members);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { content, messageType = "text" } = req.body;

    const hasAccess = await chatService.checkRoomAccess(req.user.id, roomId);
    if (!hasAccess) {
      return res.status(403).json({ error: "Access denied" });
    }

    const message = await chatService.createMessage({
      roomId,
      userId: req.user.id,
      content,
      messageType,
    });

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createRoom = async (req, res) => {
  try {
    const { name, description, isPrivate = false } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Room name is required" });
    }

    const room = await chatService.createRoom({
      name,
      description,
      isPrivate,
      createdBy: req.user.id,
    });

    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
