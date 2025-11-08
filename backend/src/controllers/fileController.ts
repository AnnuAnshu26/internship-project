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

export const uploadFile = async (req:any, res:any) => {
  try {
    const { teamId } = req.body;
    const file = req.file;
    const user = await User.findById(req.user.id);

    if (!file) return res.status(400).json({ message: "No file" });

    // upload local temp file
    const result = await cloudinary.v2.uploader.upload(file.path, { resource_type: "auto", folder: `hackcollab/${teamId}` });

    // save record
    const fileDoc = await FileModel.create({
      teamId,
      fileName: file.originalname,
      fileUrl: result.secure_url,
      fileSize: file.size,
      uploadedBy: user._id,
      uploadedByName: user.name
    });

    // delete temp file
    fs.unlinkSync(file.path);

    res.json({ file: fileDoc });
  } catch (err:any) {
    console.error(err);
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
