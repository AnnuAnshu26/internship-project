import Task from "../models/Task.js"; // ✅ added .js
import Notification from "../models/Notification.js"; // ✅ added .js
// ✅ Add a new task
export const addTask = async (req, res) => {
    try {
        const { teamId, title, description, assignedTo } = req.body;
        if (!title) {
            res.status(400).json({ message: "Title required" });
            return;
        }
        const task = await Task.create({
            teamId,
            title,
            description,
            assignedTo,
            status: "Pending",
        });
        await Notification.create({
            teamId,
            title: "New Task",
            subtitle: `${title} added`,
            type: "task",
        });
        res.status(201).json({ task });
    }
    catch (err) {
        console.error("❌ Add Task Error:", err);
        res.status(500).json({ message: err.message });
    }
};
// ✅ Update an existing task
export const updateTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        const updates = req.body;
        const task = await Task.findByIdAndUpdate(taskId, { ...updates, updatedAt: new Date() }, { new: true });
        if (!task) {
            res.status(404).json({ message: "Task not found" });
            return;
        }
        // Create a notification when marked as completed
        if (updates.status === "Completed") {
            await Notification.create({
                teamId: task.teamId,
                title: "Task Completed",
                subtitle: `${task.title} completed`,
                type: "task",
            });
        }
        res.status(200).json({ task });
    }
    catch (err) {
        console.error("❌ Update Task Error:", err);
        res.status(500).json({ message: err.message });
    }
};
// ✅ List all tasks for a team
export const listTasks = async (req, res) => {
    try {
        const { teamId } = req.params;
        const tasks = await Task.find({ teamId }).sort({ createdAt: -1 });
        res.status(200).json({ tasks });
    }
    catch (err) {
        console.error("❌ List Tasks Error:", err);
        res.status(500).json({ message: err.message });
    }
};
