import { Router } from "express";
import { authenticateSocket } from "../middleware/auth.middleware.js";
import * as roomController from "../controllers/room.controller.js";

const router = Router();

router.get("/", authenticateSocket, roomController.getRooms);

router.post("/", authenticateSocket, roomController.createRoom);

router.post("/join/:code", authenticateSocket, roomController.joinRoom);

router.get("/:roomId/messages", authenticateSocket, roomController.getRoomMessages);

router.get("/:roomId/members", authenticateSocket, roomController.getRoomMembers);

export default router;
