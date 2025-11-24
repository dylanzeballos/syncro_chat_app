import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import * as chatController from "../controllers/chat.controller.js";

const router = Router();

router.get("/rooms", authMiddleware, chatController.getUserRooms);

router.post("/rooms", authMiddleware, chatController.createRoom);

router.get(
  "/rooms/:roomId/messages",
  authMiddleware,
  chatController.getRoomMessages
);

router.get(
  "/rooms/:roomId/members",
  authMiddleware,
  chatController.getRoomMembers
);

router.post(
  "/rooms/:roomId/messages",
  authMiddleware,
  chatController.sendMessage
);

router.delete(
  "/rooms/:roomId/members",
  authMiddleware,
  chatController.leaveRoom
);

export default router;
