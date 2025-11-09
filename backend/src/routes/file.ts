import express from "express";
import multer from "multer";
import { authMiddleware } from "../middleware/auth.js"; // ✅ added .js
import { uploadFile, listFiles } from "../controllers/fileController.js"; // ✅ added .js

const router = express.Router();

// Temporary file storage before upload
const upload = multer({ dest: "tmp/uploads/" });

// Upload a file
router.post("/upload", authMiddleware, upload.single("file"), uploadFile);

// List all files for a team
router.get("/:teamId", authMiddleware, listFiles);

export default router;
