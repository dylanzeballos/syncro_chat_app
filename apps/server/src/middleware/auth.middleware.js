import { verifySupabaseToken } from "../services/auth.service.js";
import logger from "../utils/logger.js";

export const verifyToken = async (token) => {
  if (!token) {
    throw new Error("No token provided");
  }
  const cleanToken = token.replace("Bearer ", "");

  return await verifySupabaseToken(cleanToken);
};

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ error: "No authorization token provided" });
    }

    const user = await verifyToken(token);
    req.user = user;
    next();
  } catch (error) {
    logger.error("Auth middleware error:", error.message);
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

export const authenticateSocket = authMiddleware;
