import express from "express";
import { getMessages, sendMessage } from "../controllers/chatController";
import { authMiddleware } from "../middleware/auth";
const router = express.Router();
router.get("/:teamId", authMiddleware, getMessages);
router.post("/:teamId", authMiddleware, sendMessage);
export default router;
