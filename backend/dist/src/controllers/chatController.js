import Message from "../models/Message.js";
import User from "../models/User.js";
// ✅ Get all messages in a team
export const getMessages = async (req, res) => {
    try {
        const { teamId } = req.params;
        const messages = await Message.find({ teamId }).sort({ createdAt: 1 });
        res.status(200).json({ messages });
    }
    catch (err) {
        console.error("❌ Get Messages Error:", err);
        res.status(500).json({ message: err.message || "Server Error" });
    }
};
// ✅ Send a new message
export const sendMessage = async (req, res) => {
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
    }
    catch (err) {
        console.error("❌ Send Message Error:", err);
        res.status(500).json({ message: err.message || "Server Error" });
    }
};
