import { Request, Response } from "express";
import FileModel from "../models/File.js";
import User from "../models/User.js";
import cloudinary from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface AuthRequest extends Request {
  user?: {
    id: string;
    name?: string;
  };
  file?: Express.Multer.File;
}

// ✅ Upload a file
export const uploadFile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { teamId } = req.body;
    const file = req.file;

    if (!file) {
      res.status(400).json({ message: "No file uploaded" });
      return;
    }

    if (!req.user?.id) {
      res.status(401).json({ message: "Unauthorized: User not found in request" });
      return;
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(404).json({ message: "User not found in database" });
      return;
    }

    // Upload to Cloudinary
    const result = await cloudinary.v2.uploader.upload(file.path, {
      resource_type: "auto",
      folder: `teamify.ai/${teamId}`,
      access_mode: "public",
    });

    // Save file info
    const fileDoc = await FileModel.create({
      teamId,
      fileName: file.originalname,
      fileUrl: result.secure_url,
      fileSize: file.size,
      uploadedBy: user._id,
      uploadedByName: user.name,
    });

    // Safely remove temporary file
    try {
      fs.unlinkSync(file.path);
    } catch (cleanupErr: any) {
      console.warn("⚠️ Failed to remove temp file:", cleanupErr.message);
    }

    res.status(200).json({ file: fileDoc });
  } catch (err: any) {
    console.error("❌ Upload Error =>", err);
    res.status(500).json({ message: err.message || "Server Error" });
  }
};

// ✅ List all files for a team
export const listFiles = async (req: Request, res: Response): Promise<void> => {
  try {
    const { teamId } = req.params;
    const files = await FileModel.find({ teamId })
      .sort({ createdAt: -1 })
      .limit(200);

    res.json({ files });
  } catch (err: any) {
    console.error("❌ List Files Error:", err);
    res.status(500).json({ message: err.message || "Server Error" });
  }
};
