import { supabase } from "../config/database.js";
import logger from "../utils/logger.js";

export const verifySupabaseToken = async (token) => {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error) throw error;

    return user;
  } catch (error) {
    logger.error("Token verification failed:", error.message);
    throw new Error("Invalid token");
  }
};

export const getUserById = async (userId) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    logger.error("Error fetching user:", error.message);
    throw error;
  }
};

export const updateUserStatus = async (userId, status) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .update({
        status,
        last_seen: new Date().toISOString(),
      })
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    logger.error("Error updating user status:", error.message);
    throw error;
  }
};
