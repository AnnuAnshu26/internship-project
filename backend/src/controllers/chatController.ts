import Message from "../models/Message";
import User from "../models/User";

export const getMessages = async (req, res) => {
  try {
    const { teamId } = req.params;

    const messages = await Message.find({ teamId: teamId }).sort({ createdAt: 1 });

    res.status(200).json({ messages });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const sendMessage = async (req:any, res:any) => {
  try {
    const { teamId } = req.params;
    const { text, fileUrl } = req.body;
    const user = await User.findById(req.user.id);
    const msg = await Message.create({ teamId, senderId: user._id, senderName: user.name, text, fileUrl });
    res.json({ message: msg });
  } catch (err:any) { res.status(500).json({ message: err.message }); }
};
