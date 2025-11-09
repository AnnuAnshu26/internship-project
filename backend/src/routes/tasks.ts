import express from "express";
import { authMiddleware } from "../middleware/auth.js"; // ✅ added .js
import { addTask, updateTask, listTasks } from "../controllers/taskController.js"; // ✅ added .js

const router = express.Router();

// Create a new task
router.post("/", authMiddleware, addTask);

// Update an existing task
router.patch("/:taskId", authMiddleware, updateTask);

// List all tasks for a team
router.get("/:teamId", authMiddleware, listTasks);

export default router;
