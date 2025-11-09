import express from "express";
import { getMessages, sendMessage } from "../controllers/chatController.js"; // ✅ added .js
import { authMiddleware } from "../middleware/auth.js"; // ✅ added .js

const router = express.Router();

// Fetch messages for a team
router.get("/:teamId", authMiddleware, getMessages);

// Send a new message in a team
router.post("/:teamId", authMiddleware, sendMessage);

export default router;
