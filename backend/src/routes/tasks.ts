import express from "express";
import { authMiddleware } from "../middleware/auth";
import { addTask, updateTask, listTasks } from "../controllers/taskController";
const router = express.Router();

router.post("/", authMiddleware, addTask);
router.patch("/:taskId", authMiddleware, updateTask);
router.get("/:teamId", authMiddleware, listTasks);

export default router;
