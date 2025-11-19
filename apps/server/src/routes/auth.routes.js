import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import * as authController from "../controllers/auth.controller.js";

const router = Router();

router.get("/verify", authMiddleware, authController.verifyToken);

router.get("/me", authMiddleware, authController.getCurrentUser);

router.patch("/status", authMiddleware, authController.updateUserStatus);

export default router;
