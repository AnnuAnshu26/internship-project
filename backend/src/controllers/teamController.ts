import Team from "../models/Team";
import User from "../models/User";
import { generateTeamCode } from "../utils/genCode";
import Notification from "../models/Notification";

export const createTeam = async (req:any, res:any) => {
  try {
    const userId = req.user.id;
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ message: "Team name required" });

    const code = generateTeamCode();
    const team = await Team.create({ name, description, teamCode: code, leaderId: userId, members: [{ userId, role: "Leader" }] });

    // update user
    await User.findByIdAndUpdate(userId, { teamId: team._id, roleInTeam: "Leader" });

    // notification (optional)
    await Notification.create({ teamId: team._id, title: "Team Created", subtitle: `${req.user.email} created the team`, type: "info" });

    res.json({ team });
  } catch (err:any) {
    res.status(500).json({ message: err.message });
  }
};

export const joinTeam = async (req:any, res:any) => {
  try {
    const userId = req.user.id;
    const { teamCode } = req.body;
    if (!teamCode) return res.status(400).json({ message: "Code required" });

    const team = await Team.findOne({ teamCode });
    if (!team) return res.status(404).json({ message: "Invalid team code" });

    // prevent double join
    if (team.members.some((m:any) => String(m.userId) === String(userId))) {
      return res.status(400).json({ message: "Already a member" });
    }

    team.members.push({ userId, role: "Member" });
    await team.save();

    await User.findByIdAndUpdate(userId, { teamId: team._id, roleInTeam: "Member" });

    // notification
    await Notification.create({ teamId: team._id, title: "Team Member Joined", subtitle: `${req.user.email} joined`, type: "join" });

    res.json({ team });
  } catch (err:any) {
    res.status(500).json({ message: err.message });
  }
};

export const getMyTeam = async (req: any, res: any) => {
  try {
    const userId = req.user.id;

    // find user
    const user = await User.findById(userId);
    if (!user || !user.teamId)
      return res.status(404).json({ message: "User is not in any team" });

    // find team and populate members
    const team = await Team.findById(user.teamId).populate(
      "members.userId",
      "name email roleInTeam"
    );

    res.json({ team });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const getTeam = async (req:any, res:any) => {
  try {
    const { teamId } = req.params;
    const team = await Team.findById(teamId).populate("members.userId", "name email roleInTeam");
    if (!team) return res.status(404).json({ message: "Team not found" });
    res.json({ team });
  } catch (err:any) {
    res.status(500).json({ message: err.message });
  }
};
