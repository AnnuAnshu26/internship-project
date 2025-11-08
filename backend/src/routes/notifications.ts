import express from "express";
import { authMiddleware } from "../middleware/auth";
import { listNotifications, markAllRead } from "../controllers/notificationController";
const router = express.Router();

router.get("/:teamId", authMiddleware, listNotifications);
router.post("/mark-read", authMiddleware, markAllRead);

export default router;
