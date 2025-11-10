"use client";

import { useState, KeyboardEvent } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function JoinTeamPage() {
  const router = useRouter();
  const [code, setCode] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleJoin = async () => {
    if (!code.trim()) {
      toast.error("Please enter a valid team code");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in first");
      router.push("/signin");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/team/join`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ teamCode: code.toUpperCase().trim() }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Invalid or expired team code");
      }

      // ✅ Save team data
      localStorage.setItem("teamId", data.team._id);
      localStorage.setItem("teamCode", data.team.teamCode);

      toast.success(`Joined team "${data.team.name}" successfully 🎉`);

      router.push("/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Something went wrong while joining the team");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Press Enter to submit
  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleJoin();
  };

  return (
    <div className="min-h-screen bg-[#0a0f1a] flex items-center justify-center px-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm sm:max-w-md bg-[#101626]/60 backdrop-blur-md border border-white/10 rounded-2xl p-6 sm:p-8 text-white shadow-lg"
      >
        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-bold text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Join a Team
        </h1>

        <p className="text-gray-400 text-center text-sm mt-2">
          Enter your team’s invite code below
        </p>

        {/* Input & Button */}
        <div className="mt-6 sm:mt-7 space-y-5">
          <input
            className="w-full px-4 py-3 bg-[#0c111c] rounded-lg border border-white/10 outline-none focus:border-blue-500 transition text-center tracking-widest uppercase font-semibold"
            placeholder="TEAM-AX12Z9"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={loading}
          />

          <button
            onClick={handleJoin}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 py-3 rounded-xl flex justify-center items-center gap-2 font-medium hover:scale-[1.02] transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <ArrowRight size={20} />
            )}
            {loading ? "Joining..." : "Join Team"}
          </button>
        </div>

        {/* Hint */}
        <p className="text-xs text-gray-500 text-center mt-4">
          Need a code? Ask your team creator for their invite code.
        </p>
      </motion.div>
    </div>
  );
}
