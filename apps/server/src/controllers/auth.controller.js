import * as authService from "../services/auth.service.js";

export const verifyToken = async (req, res) => {
  try {
    const user = await authService.getUserById(req.user.id);
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const user = await authService.getUserById(req.user.id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const user = await authService.updateUserStatus(req.user.id, status);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
