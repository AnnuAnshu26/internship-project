import { Request, Response } from "express";
import Message from "../models/Message.js";
import User from "../models/User.js";

interface AuthRequest extends Request {
  user?: {
    id: string;
    name?: string;
  };
}

// ✅ Get all messages in a team
export const getMessages = async (req: Request, res: Response): Promise<void> => {
  try {
    const { teamId } = req.params;

    const messages = await Message.find({ teamId }).sort({ createdAt: 1 });
    res.status(200).json({ messages });
  } catch (err: any) {
    console.error("❌ Get Messages Error:", err);
    res.status(500).json({ message: err.message || "Server Error" });
  }
};

// ✅ Send a new message
export const sendMessage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { teamId } = req.params;
    const { text, fileUrl } = req.body;

    if (!req.user?.id) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const msg = await Message.create({
      teamId,
      senderId: user._id,
      senderName: user.name,
      text,
      fileUrl,
    });

    res.json({ message: msg });
  } catch (err: any) {
    console.error("❌ Send Message Error:", err);
    res.status(500).json({ message: err.message || "Server Error" });
  }
};
