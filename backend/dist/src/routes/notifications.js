import express from "express";
import { authMiddleware } from "../middleware/auth.js"; // ✅ added .js
import { listNotifications, markAllRead } from "../controllers/notificationController.js"; // ✅ added .js
const router = express.Router();
// Get all notifications for a team
router.get("/:teamId", authMiddleware, listNotifications);
// Mark all notifications as read
router.post("/mark-read", authMiddleware, markAllRead);
export default router;
