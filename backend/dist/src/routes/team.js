import express from "express";
import { createTeam, joinTeam, getMyTeam, getTeam } from "../controllers/teamController.js"; // ✅ added .js
import { authMiddleware } from "../middleware/auth.js"; // ✅ added .js
const router = express.Router();
// Create a new team
router.post("/create", authMiddleware, createTeam);
// Join a team
router.post("/join", authMiddleware, joinTeam);
// Get teams for the logged-in user
router.get("/me", authMiddleware, getMyTeam);
// Get a specific team by ID
router.get("/:teamId", authMiddleware, getTeam);
export default router;
