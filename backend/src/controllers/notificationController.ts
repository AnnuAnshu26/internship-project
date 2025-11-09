import Notification from "../models/Notification.js"; // ✅ added .js extension

// ✅ List notifications for a team
export const listNotifications = async (req: any, res: any) => {
  try {
    const { teamId } = req.params;

    const notifications = await Notification.find({ teamId })
      .sort({ createdAt: -1 })
      .limit(200);

    res.status(200).json({ notifications });
  } catch (err: any) {
    console.error("❌ List Notifications Error:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

// ✅ Mark all notifications as read
export const markAllRead = async (req: any, res: any) => {
  try {
    const { teamId } = req.body;

    if (!teamId) {
      res.status(400).json({ message: "Team ID required" });
      return;
    }

    await Notification.updateMany({ teamId }, { $set: { read: true } });

    res.status(200).json({ ok: true });
  } catch (err: any) {
    console.error("❌ Mark All Read Error:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};
