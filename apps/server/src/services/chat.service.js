import { supabase } from "../config/database.js";
import logger from "../utils/logger.js";

const generateRoomCode = () => {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 10; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const codeExists = async (code) => {
  const { data, error } = await supabase
    .from("rooms")
    .select("id")
    .eq("code_room", code)
    .single();

  return !error && data;
};

const generateUniqueRoomCode = async () => {
  let code;
  let attempts = 0;
  const maxAttempts = 10;

  do {
    code = generateRoomCode();
    attempts++;
    if (attempts > maxAttempts) {
      throw new Error("Could not generate unique room code");
    }
  } while (await codeExists(code));

  return code;
};

export const checkRoomAccess = async (userId, roomId) => {
  try {
    const { data, error } = await supabase
      .from("room_members")
      .select("id")
      .eq("user_id", userId)
      .eq("room_id", roomId)
      .single();

    return !error && data;
  } catch (error) {
    logger.error("Error checking room access:", error.message);
    return false;
  }
};

export const createMessage = async ({
  roomId,
  userId,
  content,
  messageType = "text",
}) => {
  try {
    const { data, error } = await supabase
      .from("messages")
      .insert({
        room_id: roomId,
        user_id: userId,
        content,
        message_type: messageType,
      })
      .select(
        `
        *,
        users:user_id (
          id,
          username,
          avatar_url
        )
      `
      )
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    logger.error("Error creating message:", error.message);
    throw error;
  }
};

export const getMessages = async (roomId, limit = 50, offset = 0) => {
  try {
    const { data, error } = await supabase
      .from("messages")
      .select(
        `
        *,
        users:user_id (
          id,
          username,
          avatar_url
        )
      `
      )
      .eq("room_id", roomId)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return data.reverse();
  } catch (error) {
    logger.error("Error fetching messages:", error.message);
    throw error;
  }
};

export const getRooms = async (userId) => {
  try {
    const { data, error } = await supabase
      .from("room_members")
      .select(
        `
        rooms:room_id (
          id,
          name,
          description,
          is_private,
          created_at
        )
      `
      )
      .eq("user_id", userId);

    if (error) throw error;

    return data.map((item) => item.rooms);
  } catch (error) {
    logger.error("Error fetching rooms:", error.message);
    throw error;
  }
};

export const getRoomMembers = async (roomId) => {
  try {
    const { data, error } = await supabase
      .from("room_members")
      .select(
        `
        role,
        users:user_id (
          id,
          username,
          avatar_url,
          status,
          last_seen
        )
      `
      )
      .eq("room_id", roomId);

    if (error) throw error;

    return data;
  } catch (error) {
    logger.error("Error fetching room members:", error.message);
    throw error;
  }
};

export const createRoom = async ({
  name,
  description,
  isPrivate = false,
  createdBy,
}) => {
  try {
    const code = await generateUniqueRoomCode();

    const { data: room, error: roomError } = await supabase
      .from("rooms")
      .insert({
        name,
        description,
        is_private: isPrivate,
        created_by: createdBy,
        code_room: code,
      })
      .select()
      .single();

    if (roomError) throw roomError;

    const { error: memberError } = await supabase.from("room_members").insert({
      room_id: room.id,
      user_id: createdBy,
      role: "admin",
    });

    if (memberError) throw memberError;

    return room;
  } catch (error) {
    logger.error("Error creating room:", error.message);
    throw error;
  }
};
