"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Users, Clock, File, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export default function DashboardPage() {
  const [team, setTeam] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [tasks, setTasks] = useState<any[]>([]);

  // ✅ FETCH TEAM
  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Login required");
          return;
        }

        const res = await fetch("http://localhost:5000/api/team/me", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        setTeam(data.team);
      } catch (err: any) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, []);

  // ✅ FETCH TASKS WHEN TEAM LOADS
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:5000/api/tasks/${team?._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setTasks(data.tasks);
      } catch (err) {
        console.log(err);
      }
    };

    if (team?._id) fetchTasks();
  }, [team]);

  // ✅ ADD TASK FUNCTION
  const handleAddTask = async () => {
    if (!taskTitle) return alert("Title required");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          teamId: team._id,
          title: taskTitle,
          description: taskDesc,
          assignedTo: assignedTo || null,
        }),
      });

      const data = await res.json();
      setTasks([data.task, ...tasks]);
      setShowTaskModal(false);
      setTaskTitle("");
      setTaskDesc("");
      setAssignedTo("");
    } catch (err) {
      alert("Failed to add task");
    }
  };

  // ✅ UPDATE TASK STATUS
  const updateTaskStatus = async (taskId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      setTasks(tasks.map(t => (t._id === taskId ? data.task : t)));
    } catch (err) {
      alert("Failed to update status");
    }
  };

  if (loading) {
    return <p className="text-center text-white mt-10">Loading Dashboard...</p>;
  }

  return (
    <div className="min-h-screen bg-[#0A0F1A] text-white p-6 flex flex-col gap-8">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, <span className="text-purple-400">{team?.name}</span>
        </h1>
        <p className="text-gray-400 mt-1">Here's your team overview</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <StatCard icon={<Clock />} value="6:45:12" label="Next Deadline" desc="Time Remaining" />
        <StatCard icon={<Users />} value={team?.members.length || 0} label="Team Members" desc="Active now" />
        <StatCard icon={<CheckCircle />} value={tasks.filter(t => t.status === "Completed").length} label="Tasks Completed" desc="Updated live" />
        <StatCard icon={<File />} value={tasks.length} label="Total Tasks" desc="Team tasks" />
      </div>

      {/* Team Members List */}
      <div className="bg-[#0F1523] p-6 rounded-xl border border-white/10">
        <h2 className="text-xl font-semibold mb-4">Team Members</h2>
        <div className="space-y-3">
          {team?.members?.map((m: any, index: number) => (
            <div key={index} className="flex items-center gap-3 bg-[#101626] p-3 rounded-lg border border-white/5">
              <div className="w-8 h-8 flex items-center justify-center bg-purple-500 rounded-full uppercase">
                {m?.userId?.name?.[0]}
              </div>
              <p>
                {m?.userId?.name}
                <span className="text-gray-400 text-sm"> ({m?.userId?.email})</span>
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* TASK SECTION */}
      <div className="bg-[#0F1523] p-6 rounded-xl border border-white/10">
        <div className="flex justify-between">
          <h2 className="text-xl font-semibold">Team Tasks</h2>
          <button
            onClick={() => setShowTaskModal(true)}
            className="bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus size={18} /> Add Task
          </button>
        </div>

        {/* TASK LIST */}
        <div className="mt-6 space-y-3">
          {tasks.map(task => (
            <div key={task._id} className="p-3 bg-[#101626] rounded border border-white/5 flex justify-between items-center">
              <div>
                <p className="font-medium">{task.title}</p>
                <p className="text-xs text-gray-400">{task.description}</p>
              </div>

              <select
                className="bg-[#0C111C] p-1 rounded border border-white/10"
                value={task.status}
                onChange={e => updateTaskStatus(task._id, e.target.value)}
              >
                <option>Pending</option>
                <option>In Progress</option>
                <option>Completed</option>
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* TASK MODAL */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center">
          <div className="bg-[#0F1523] p-6 rounded-xl w-[400px] border border-white/10">
            <h2 className="text-xl font-semibold mb-4">Add New Task</h2>

            <input
              placeholder="Task title"
              className="w-full p-2 rounded bg-[#0C111C] border border-white/10 mb-3"
              value={taskTitle}
              onChange={e => setTaskTitle(e.target.value)}
            />

            <textarea
              placeholder="Description"
              className="w-full p-2 rounded bg-[#0C111C] border border-white/10 mb-3"
              value={taskDesc}
              onChange={e => setTaskDesc(e.target.value)}
            />

            <select
              className="w-full p-2 rounded bg-[#0C111C] border border-white/10 mb-4"
              value={assignedTo}
              onChange={e => setAssignedTo(e.target.value)}
            >
              <option value="">Assign to</option>
              {team?.members?.map((m: any) => (
                <option key={m.userId._id} value={m.userId._id}>
                  {m.userId.name}
                </option>
              ))}
            </select>

            <div className="flex justify-end gap-3">
              <button onClick={() => setShowTaskModal(false)} className="px-3 py-1 text-gray-300">
                Cancel
              </button>
              <button onClick={handleAddTask} className="bg-blue-600 px-4 py-2 rounded">
                Add Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, value, label, desc }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#101626] p-5 rounded-xl border border-white/10 flex flex-col gap-2"
    >
      <div className="text-purple-400">{icon}</div>
      <h1 className="text-3xl font-bold">{value}</h1>
      <p className="text-sm">{label}</p>
      <p className="text-xs text-gray-500">{desc}</p>
    </motion.div>
  );
}
