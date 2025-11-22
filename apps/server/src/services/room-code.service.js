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

export const generateUniqueRoomCode = async () => {
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
