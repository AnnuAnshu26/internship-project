"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Zap, Users, Sparkles, Trophy, ArrowRight } from "lucide-react";
import Navbar from "../commonComponents/NavBar";

export default function Landing() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#020617] via-[#0a0f2c] to-[#001a3a] text-white">
      {/* Navbar */}
      <Navbar />

      {/* Animated Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.15),transparent_60%),radial-gradient(circle_at_80%_80%,rgba(99,102,241,0.15),transparent_60%)] animate-pulse" />

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-6 py-24 text-center flex flex-col items-center justify-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-7xl font-extrabold leading-tight mb-6"
        >
          Win Hackathons with
          <span className="block bg-gradient-to-r from-sky-400 via-indigo-400 to-sky-400 bg-clip-text text-transparent animate-pulse mt-2">
            AI-Powered Teams
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10"
        >
          Collaborate seamlessly, manage tasks efficiently, and leverage AI to
          generate pitches, summarize discussions, and guide your team to
          victory.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link href="/auth">
            <Button
              size="lg"
              className="bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-indigo-500 hover:to-sky-400 hover:scale-105 transition-all duration-300 text-white font-semibold shadow-lg shadow-sky-500/30"
            >
              Get Started
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
          <Button
            size="lg"
            variant="outline"
            className="border-slate-500 text-slate-300 hover:bg-slate-800/50 hover:text-white transition-all duration-300 bg-black/30"
          >
            Watch Demo
          </Button>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 container mx-auto px-6 pb-24 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {[
          {
            icon: <Users className="w-10 h-10 text-sky-400" />,
            title: "Smart Team Management",
            description:
              "Create teams, assign roles, and track progress with intuitive dashboards and real-time updates.",
          },
          {
            icon: <Sparkles className="w-10 h-10 text-indigo-400" />,
            title: "AI-Powered Tools",
            description:
              "Generate pitches, summarize chats, and get intelligent insights that drive innovation.",
          },
          {
            icon: <Trophy className="w-10 h-10 text-sky-400" />,
            title: "Win Together",
            description:
              "Collaborate in real time with chat, file sharing, and task tracking — all in one unified platform.",
          },
        ].map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 * i }}
            viewport={{ once: true }}
          >
            <FeatureCard {...f} />
          </motion.div>
        ))}
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800 py-6 text-center text-slate-500 text-sm">
        © {new Date().getFullYear()} Teamify.AI — Built for creators & innovators.
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="group p-8 rounded-2xl bg-slate-900/40 border border-slate-800 hover:bg-slate-800/70 transition-all duration-300 cursor-pointer text-center backdrop-blur-sm"
    >
      <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center bg-gradient-to-br from-sky-500/20 to-indigo-500/20 rounded-xl group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3 text-white">{title}</h3>
      <p className="text-slate-400 text-sm">{description}</p>
    </motion.div>
  );
}
