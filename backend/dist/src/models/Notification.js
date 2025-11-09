import mongoose from "mongoose";
const NotificationSchema = new mongoose.Schema({
    teamId: { type: mongoose.Schema.Types.ObjectId, ref: "Team", required: true, index: true },
    title: { type: String, required: true },
    subtitle: { type: String, default: "" },
    type: { type: String, default: "info" },
    read: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});
export default mongoose.models.Notification || mongoose.model("Notification", NotificationSchema);
