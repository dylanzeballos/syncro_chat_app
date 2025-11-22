import { Router } from "express";
import { authenticateSocket } from "../middleware/auth.middleware.js";
import * as userController from "../controllers/user.controller.js";

const router = Router();

router.post("/sync", authenticateSocket, userController.syncUser);

router.get("/profile", authenticateSocket, userController.getUserProfile);

router.patch("/status", authenticateSocket, userController.updateUserStatus);

export default router;
