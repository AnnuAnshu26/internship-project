"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function JoinTeamPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleJoin = async () => {
    if (!code.trim()) {
      toast.error("Please enter a team code");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login first");
      router.push("/signin");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/team/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ teamCode: code.toUpperCase() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Invalid Team Code");
      }

      toast.success("Team joined successfully!");

// ✅ Save both Mongo _id and teamCode

localStorage.setItem("teamId", data.team._id);
localStorage.setItem("teamCode", data.team.teamCode);

router.push("/dashboard");


    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f1a] flex items-center justify-center px-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm sm:max-w-md bg-[#101626]/60 backdrop-blur-md border border-white/10 rounded-2xl p-6 sm:p-8 text-white shadow-lg"
      >
        <h1 className="text-white text-2xl sm:text-5xl font-bold text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Join Team
        </h1>

        <p className="text-gray-400 text-center text-xs sm:text-sm mt-1">
          Enter team invite code to join
        </p>

        <div className="mt-6 sm:mt-7 space-y-5">

          {/* Input */}
          <input
            className="w-full px-4 py-3 bg-[#0c111c] rounded-lg border border-white/10 outline-none focus:border-blue-500 transition text-center tracking-widest uppercase"
            placeholder="TEAM-AX12Z9"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />

          {/* Button */}
          <button
            onClick={handleJoin}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 py-3 rounded-xl flex justify-center items-center gap-2 font-medium hover:scale-[1.02] transition"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <ArrowRight size={20} />}
            {loading ? "Joining..." : "Join Team"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
