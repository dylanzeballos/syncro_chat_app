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

export const syncUser = async (user) => {
  try {
    const { data: existingUser, error: checkError } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      throw checkError;
    }

    if (existingUser) {
      const { data: updatedUser, error: updateError } = await supabase
        .from("users")
        .update({
          last_seen: new Date().toISOString(),
          status: 'online'
        })
        .eq("id", user.id)
        .select()
        .single();

      if (updateError) throw updateError;
      logger.info(`User updated: ${user.id}`);
      return updatedUser;
    } else {
      let baseUsername = user.user_metadata?.full_name || user.email.split('@')[0];
      let username = baseUsername;
      let counter = 1;

      while (true) {
        const { data: existingUsername, error: checkUsernameError } = await supabase
          .from("users")
          .select("id")
          .eq("username", username)
          .maybeSingle();

        if (checkUsernameError && checkUsernameError.code !== 'PGRST116') {
          throw checkUsernameError;
        }

        if (!existingUsername) {
          break;
        }

        username = `${baseUsername}${counter}`;
        counter++;
      }

      const { data: newUser, error: insertError } = await supabase
        .from("users")
        .insert({
          id: user.id,
          username: username,
          email: user.email,
          avatar_url: user.user_metadata?.avatar_url,
          status: 'online',
          last_seen: new Date().toISOString(),
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (insertError) throw insertError;
      logger.info(`New user created: ${user.id} with username ${username}`);
      return newUser;
    }
  } catch (error) {
    logger.error("Error syncing user:", error.message);
    throw error;
  }
};
