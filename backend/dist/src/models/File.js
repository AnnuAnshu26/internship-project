import mongoose from "mongoose";
const FileSchema = new mongoose.Schema({
    teamId: { type: mongoose.Schema.Types.ObjectId, ref: "Team", required: true, index: true },
    fileName: { type: String },
    fileUrl: { type: String },
    fileSize: { type: Number },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    uploadedByName: { type: String },
    createdAt: { type: Date, default: Date.now }
});
export default mongoose.models.File || mongoose.model("File", FileSchema);
