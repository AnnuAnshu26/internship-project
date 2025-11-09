import Team from "../models/Team.js"; // ✅ added .js
import User from "../models/User.js"; // ✅ added .js
import { generateTeamCode } from "../utils/genCode.js"; // ✅ added .js
import Notification from "../models/Notification.js"; // ✅ added .js
// ✅ Create a new team
export const createTeam = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, description } = req.body;
        if (!name) {
            res.status(400).json({ message: "Team name required" });
            return;
        }
        const code = generateTeamCode();
        const team = await Team.create({
            name,
            description,
            teamCode: code,
            leaderId: userId,
            members: [{ userId, role: "Leader" }],
        });
        await User.findByIdAndUpdate(userId, {
            teamId: team._id,
            roleInTeam: "Leader",
        });
        await Notification.create({
            teamId: team._id,
            title: "Team Created",
            subtitle: `${req.user.email} created the team`,
            type: "info",
        });
        res.status(201).json({ team });
    }
    catch (err) {
        console.error("❌ Create Team Error:", err);
        res.status(500).json({ message: err.message || "Server error" });
    }
};
// ✅ Join an existing team
export const joinTeam = async (req, res) => {
    try {
        const userId = req.user.id;
        const { teamCode } = req.body;
        if (!teamCode) {
            res.status(400).json({ message: "Team code required" });
            return;
        }
        const team = await Team.findOne({ teamCode });
        if (!team) {
            res.status(404).json({ message: "Invalid team code" });
            return;
        }
        if (team.members.some((m) => String(m.userId) === String(userId))) {
            res.status(400).json({ message: "Already a member" });
            return;
        }
        team.members.push({ userId, role: "Member" });
        await team.save();
        await User.findByIdAndUpdate(userId, {
            teamId: team._id,
            roleInTeam: "Member",
        });
        await Notification.create({
            teamId: team._id,
            title: "Team Member Joined",
            subtitle: `${req.user.email} joined`,
            type: "join",
        });
        res.status(200).json({ team });
    }
    catch (err) {
        console.error("❌ Join Team Error:", err);
        res.status(500).json({ message: err.message || "Server error" });
    }
};
// ✅ Get logged-in user’s team
export const getMyTeam = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);
        if (!user || !user.teamId) {
            res.status(404).json({ message: "User is not in any team" });
            return;
        }
        const team = await Team.findById(user.teamId).populate("members.userId", "name email roleInTeam");
        res.status(200).json({ team });
    }
    catch (err) {
        console.error("❌ Get My Team Error:", err);
        res.status(500).json({ message: err.message || "Server error" });
    }
};
// ✅ Get team by ID
export const getTeam = async (req, res) => {
    try {
        const { teamId } = req.params;
        const team = await Team.findById(teamId).populate("members.userId", "name email roleInTeam");
        if (!team) {
            res.status(404).json({ message: "Team not found" });
            return;
        }
        res.status(200).json({ team });
    }
    catch (err) {
        console.error("❌ Get Team Error:", err);
        res.status(500).json({ message: err.message || "Server error" });
    }
};
