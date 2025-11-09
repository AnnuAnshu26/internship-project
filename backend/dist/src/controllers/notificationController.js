import Notification from "../models/Notification";
export const listNotifications = async (req, res) => {
    try {
        const { teamId } = req.params;
        const notifications = await Notification.find({ teamId }).sort({ createdAt: -1 }).limit(200);
        res.json({ notifications });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
export const markAllRead = async (req, res) => {
    try {
        const { teamId } = req.body;
        await Notification.updateMany({ teamId }, { $set: { read: true } });
        res.json({ ok: true });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
