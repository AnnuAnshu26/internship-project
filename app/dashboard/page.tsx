"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Users, Clock, File, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export default function DashboardPage() {
  const [team, setTeam] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
        <StatCard icon={<Clock />} value="23:45:12" label="Next Deadline" desc="Time Remaining" />
        <StatCard icon={<Users />} value={team?.members.length || 0} label="Team Members" desc="Active now" />
        <StatCard icon={<CheckCircle />} value="12/18" label="Tasks Completed" desc="67% done" />
        <StatCard icon={<File />} value="24" label="Files Uploaded" desc="+3 today" />
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

      {/* Project Progress (Static For Now) */}
      <div className="bg-[#0F1523] p-6 rounded-xl border border-white/10">
        <div className="flex justify-between">
          <h2 className="text-xl font-semibold">Project Progress</h2>
          <button className="bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 rounded-lg flex items-center gap-2">
            <Plus size={18} /> Add Task
          </button>
        </div>
        <div className="mt-6 flex flex-col gap-5">
          <ProgressRow title="Idea & Research" percent={100} status="Completed" />
          <ProgressRow title="Design & Prototype" percent={80} status="In Progress" />
          <ProgressRow title="Development" percent={60} status="In Progress" />
          <ProgressRow title="Pitch Preparation" percent={30} status="Pending" />
        </div>
      </div>
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

function ProgressRow({ title, percent, status }: any) {
  return (
    <div>
      <div className="flex justify-between">
        <p>{title}</p>
        <p className="text-sm text-gray-400">{percent}% • {status}</p>
      </div>
      <div className="w-full h-2 bg-[#1A2031] rounded-lg mt-2">
        <div
          className="h-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
