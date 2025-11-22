import { supabase } from "../config/database.js";
import logger from "../utils/logger.js";
import { generateUniqueRoomCode } from "./room-code.service.js";

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

export const joinRoomByCode = async (code, userId) => {
  try {
    const { data: room, error: roomError } = await supabase
      .from("rooms")
      .select("*")
      .eq("code_room", code)
      .single();

    if (roomError || !room) {
      throw new Error("Room not found");
    }

    const { data: existingMember } = await supabase
      .from("room_members")
      .select("id")
      .eq("room_id", room.id)
      .eq("user_id", userId)
      .single();

    if (existingMember) {
      throw new Error("Already a member");
    }

    const { error: memberError } = await supabase
      .from("room_members")
      .insert({
        room_id: room.id,
        user_id: userId,
        role: "member",
      });

    if (memberError) throw memberError;

    return room;
  } catch (error) {
    logger.error("Error joining room by code:", error.message);
    throw error;
  }
};
