import mongoose from "mongoose";
const TeamSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, default: "" },
    teamCode: { type: String, required: true, unique: true, index: true },
    leaderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    members: [
        {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            role: { type: String, default: "Member" },
            joinedAt: { type: Date, default: Date.now }
        }
    ],
    createdAt: { type: Date, default: Date.now }
});
export default mongoose.models.Team || mongoose.model("Team", TeamSchema);
