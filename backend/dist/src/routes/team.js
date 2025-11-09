import express from "express";
import { createTeam, joinTeam, getMyTeam, getTeam } from "../controllers/teamController";
import { authMiddleware } from "../middleware/auth";
const router = express.Router();
router.post("/create", authMiddleware, createTeam);
router.post("/join", authMiddleware, joinTeam);
router.get("/me", authMiddleware, getMyTeam);
router.get("/:teamId", authMiddleware, getTeam);
export default router;
