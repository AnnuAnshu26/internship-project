"use client";

import { motion } from "framer-motion";
import { Plus, Users, Clock, File, CheckCircle } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#0A0F1A] text-white p-6 flex flex-col gap-8">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, <span className="text-purple-400">Team Leader!</span></h1>
        <p className="text-gray-400 mt-1">Here's what's happening with your hackathon project</p>
      </div>


      {/* Top Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">

        {/* Quick AI Assist */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#101626] p-5 rounded-xl border border-white/10 flex flex-col gap-2"
        >
          <p className="text-sm text-gray-400">Next Deadline</p>
          <h1 className="text-3xl font-bold">23:45:12</h1>
          <p className="text-sm text-gray-400 flex items-center gap-2">
            <Clock className="w-4 h-4" /> Time Remaining
          </p>
        </motion.div>

        {/* Team Members */}
        <CardSmall icon={<Users />} value="5" label="Team Members" desc="All active" />

        {/* Tasks Completed */}
        <CardSmall icon={<CheckCircle />} value="12/18" label="Tasks Completed" desc="67% done" />

        {/* Files Uploaded */}
        <CardSmall icon={<File />} value="24" label="Files Uploaded" desc="+3 today" />
      </div>


      {/* Project Progress */}
      <div className="bg-[#0F1523] p-6 rounded-xl border border-white/10">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Project Progress</h2>
          <button className="bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 rounded-lg flex items-center gap-2 hover:scale-[1.03] transition">
            <Plus size={18} /> Add Task
          </button>
        </div>

        {/* Progress Items */}
        <div className="mt-6 flex flex-col gap-5">

          <ProgressRow title="Idea & Research" percent={100} status="Completed" />
          <ProgressRow title="Design & Prototype" percent={80} status="In Progress" />
          <ProgressRow title="Development" percent={60} status="In Progress" />
          <ProgressRow title="Pitch Preparation" percent={30} status="Pending" />

        </div>
      </div>


      {/* Recent Activity */}
      <div className="bg-[#0F1523] p-6 rounded-xl border border-white/10">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>

        <ActivityRow initials="A" text="Anushka uploaded presentation.pptx" time="2 min ago" />
        <ActivityRow initials="R" text="Rahul completed UI design task" time="15 min ago" />
        <ActivityRow initials="A" text="AI Assistant generated pitch summary" time="1 hour ago" />
        <ActivityRow initials="P" text="Priya added 3 new tasks" time="2 hours ago" />
      </div>
    </div>
  );
}


/* -------------------------------------------------------------------------------- */
/* Small Stat Card */
function CardSmall({ icon, value, label, desc }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#101626] p-5 rounded-xl border border-white/10 flex flex-col gap-2"
    >
      <div className="text-purple-400">{icon}</div>
      <h1 className="text-3xl font-bold">{value}</h1>
      <p className="text-sm text-gray-300">{label}</p>
      <p className="text-xs text-gray-500">{desc}</p>
    </motion.div>
  );
}

/* Progress Row Component */
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

/* Activity Component */
function ActivityRow({ initials, text, time }: any) {
  return (
    <div className="flex items-center gap-4 border-b border-white/5 py-3">
      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-blue-500 font-semibold">
        {initials}
      </div>

      <div className="flex justify-between w-full">
        <p>{text}</p>
        <span className="text-gray-400 text-sm">{time}</span>
      </div>
    </div>
  );
}
