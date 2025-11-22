import { supabase } from "../config/database.js";
import logger from "../utils/logger.js";

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
