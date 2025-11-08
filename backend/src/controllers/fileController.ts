import FileModel from "../models/File";
import User from "../models/User";
import cloudinary from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export const uploadFile = async (req, res) => {
  try {
    const { teamId } = req.body;
    const file = req.file;

    if (!file) return res.status(400).json({ message: "No file uploaded" });

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized: User not found in request" });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found in database" });

    // Upload to Cloudinary
    const result = await cloudinary.v2.uploader.upload(file.path, {
      resource_type: "auto",
      folder: `teamify.ai/${teamId}`,
      access_mode: "public"
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

    // Safely remove tmp file
    try {
      fs.unlinkSync(file.path);
    } catch {}

    res.status(200).json({ file: fileDoc });

  } catch (err) {
    console.error("❌ Upload Error =>", err);
    res.status(500).json({ message: err.message });
  }
};


export const listFiles = async (req:any, res:any) => {
  try {
    const { teamId } = req.params;
    const files = await FileModel.find({ teamId }).sort({ createdAt: -1 }).limit(200);
    res.json({ files });
  } catch (err:any) {
    res.status(500).json({ message: err.message });
  }
};
