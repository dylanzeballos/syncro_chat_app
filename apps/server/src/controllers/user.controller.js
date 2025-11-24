import * as authService from "../services/auth.service.js";
import logger from "../utils/logger.js";

export const syncUser = async (req, res) => {
  try {
    const user = req.user;
    const syncedUser = await authService.syncUser(user);
    res.json(syncedUser);
  } catch (error) {
    logger.error("Error syncing user:", error.message);
    res.status(500).json({ message: "Failed to sync user" });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await authService.getUserById(req.user.id);
    res.json(user);
  } catch (error) {
    logger.error("Error fetching user profile:", error.message);
    res.status(500).json({ message: "Failed to fetch user profile" });
  }
};

export const updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['online', 'away', 'busy', 'offline'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const updatedUser = await authService.updateUserStatus(req.user.id, status);
    res.json(updatedUser);
  } catch (error) {
    logger.error("Error updating user status:", error.message);
    res.status(500).json({ message: "Failed to update status" });
  }
};
