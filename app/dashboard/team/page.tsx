"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Search, UserPlus, Copy } from "lucide-react";
import { toast } from "sonner";

export default function TeamPage() {
  const [team, setTeam] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // ✅ Fetch team data from backend
  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return toast.error("Login required");

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

  if (loading) return <p className="text-center text-white mt-10">Loading Team...</p>;

  const members = team?.members || [];

  return (
    <div className="p-6 sm:p-8 bg-[#0a0f1a] text-white min-h-screen flex flex-col gap-10">

      {/* ---------- TEAM HEADER ---------- */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#0f1523] border border-white/10 p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{team?.name || "Your Team"}</h1>
          <p className="text-gray-400 mt-1">{team?.description || "No description added"}</p>

          {/* badges */}
          <div className="flex gap-3 mt-4">
            <span className="px-4 py-1.5 rounded-full bg-[#1e2637] text-purple-300 text-sm">
              {members.length} Members
            </span>
            <span className="px-4 py-1.5 rounded-full bg-[#1e2637] text-purple-300 text-sm">
              Team Active ✅
            </span>
          </div>
        </div>

        {/* Invite Users */}
        <div className="flex flex-col sm:items-end gap-3 mt-6 sm:mt-0">
          <button
            onClick={() => {
              navigator.clipboard.writeText(team?.teamCode);
              toast.success("Team code copied! Send it to your team members.");
            }}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 px-5 py-2 rounded-xl font-medium hover:scale-[1.03] transition"
          >
            <UserPlus size={18} /> Invite Members
          </button>

          {/* Team Code Box */}
          <div
            onClick={() => {
              navigator.clipboard.writeText(team?.teamCode);
              toast.success("Team code copied!");
            }}
            className="flex cursor-pointer items-center gap-2 bg-[#1a2031] border border-white/10 px-4 py-2 rounded-lg"
          >
            <span className="text-sm text-gray-300">{team?.teamCode || "Loading..."}</span>
            <Copy className="w-4 h-4 text-gray-300 hover:text-white" />
          </div>
        </div>
      </motion.div>

      {/* ---------- TEAM MEMBERS SECTION ---------- */}
      <section>
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-semibold">Team Members</h2>

          <div className="flex items-center gap-2 bg-[#111827] px-3 py-2 rounded-lg border border-white/10 w-60">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              placeholder="Search members..."
              className="bg-transparent outline-none text-sm w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Members Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {members
            .filter(
              (m: any) =>
                m.userId.name.toLowerCase().includes(search.toLowerCase()) ||
                m.userId.email.toLowerCase().includes(search.toLowerCase()) ||
                m.role.toLowerCase().includes(search.toLowerCase())
            )
            .map((m: any, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#101626] border border-white/5 p-5 rounded-xl flex justify-between items-center"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center font-bold">
                    {m.userId.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium">{m.userId.name}</p>
                    <p className="text-sm text-gray-400">{m.role}</p>
                  </div>
                </div>

                <button className="bg-[#0d1320] border border-white/10 text-sm px-4 py-2 rounded-lg hover:bg-[#141b2c] transition">
                  View Profile
                </button>
              </motion.div>
            ))}
        </div>
      </section>

    </div>
  );
}
