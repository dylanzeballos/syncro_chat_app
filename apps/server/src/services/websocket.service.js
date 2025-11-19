import { supabase } from "../config/database.js";
import logger from "../utils/logger.js";

export const updateUserStatus = async (userId, status) => {
  try {
    const { error } = await supabase
      .from("users")
      .update({
        status,
        last_seen: new Date().toISOString(),
      })
      .eq("id", userId);

    if (error) throw error;

    logger.info(`User ${userId} status updated to ${status}`);
  } catch (error) {
    logger.error("Error updating user status:", error.message);
  }
};
