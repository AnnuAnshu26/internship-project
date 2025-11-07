"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Users, UserPlus, ArrowRight } from "lucide-react";

export default function TeamChoosePage() {
  return (
    <div className="min-h-screen bg-[#0a0f1a] flex items-center justify-center px-5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl w-full text-white text-center"
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          Choose Your Path
        </h1>

        <p className="text-gray-400 mt-2 text-lg mb-8">
          Create a team or join one using code
        </p>

        <div className="grid sm:grid-cols-2 gap-6 sm:gap-8 mt-12">

          {/* ✅ CREATE TEAM CARD */}
          <Link href="/team/create-team">
            <motion.div
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="group p-8 rounded-2xl bg-[#101626] border border-white/10 hover:border-purple-500/40 hover:shadow-[0px_0px_25px_rgba(120,50,255,0.25)] transition-all"
            >
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center mx-auto group-hover:scale-110 transition">
                <UserPlus size={30} className="text-white" />
              </div>

              <h2 className="text-2xl font-semibold mt-5">Create a New Team</h2>
              <p className="text-gray-400 text-sm mt-2">
                Start fresh and build your hackathon project
              </p>

              <div className="flex justify-center items-center mt-5 text-purple-400 font-medium gap-1">
                Continue <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
              </div>
            </motion.div>
          </Link>

          {/* ✅ JOIN TEAM CARD */}
          <Link href="/team/join-team">
            <motion.div
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="group p-8 rounded-2xl bg-[#101626] border border-white/10 hover:border-blue-500/40 hover:shadow-[0px_0px_25px_rgba(50,120,255,0.25)] transition-all"
            >
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center mx-auto group-hover:scale-110 transition">
                <Users size={30} className="text-white" />
              </div>

              <h2 className="text-2xl font-semibold mt-5">Join Existing Team</h2>
              <p className="text-gray-400 text-sm mt-2">
                Enter invite code to collaborate with your team
              </p>

              <div className="flex justify-center items-center mt-5 text-blue-400 font-medium gap-1">
                Continue <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
              </div>
            </motion.div>
          </Link>

        </div>
      </motion.div>
    </div>
  );
}
