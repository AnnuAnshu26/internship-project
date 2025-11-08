import express from "express";
import multer from "multer";
import { authMiddleware } from "../middleware/auth";
import { uploadFile, listFiles } from "../controllers/fileController";
const router = express.Router();

// temp storage
const upload = multer({ dest: "tmp/uploads/" });

router.post("/upload", authMiddleware, upload.single("file"), uploadFile);
router.get("/:teamId", authMiddleware, listFiles);

export default router;
