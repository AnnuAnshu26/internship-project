import mongoose from "mongoose";
const MessageSchema = new mongoose.Schema({
    teamId: { type: mongoose.Schema.Types.ObjectId, ref: "Team", required: true, index: true },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    senderName: { type: String },
    text: { type: String },
    fileUrl: { type: String },
    createdAt: { type: Date, default: Date.now }
});
export default mongoose.models.Message || mongoose.model("Message", MessageSchema);
