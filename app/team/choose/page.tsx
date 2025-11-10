"use client";

import { motion, Variants } from "framer-motion";
import Link from "next/link";
import { Users, UserPlus, ArrowRight, Zap, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function TeamChoosePage() {
  const router = useRouter();

  // ✅ Properly typed Variants
  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 25 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.15 * i,
        duration: 0.4,
        ease: [0.25, 0.1, 0.25, 1], // ✅ "easeOut" replaced with cubic-bezier equivalent
      },
    }),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#090d17] via-[#0b1120] to-[#050910] flex items-center justify-center relative overflow-hidden px-5 text-white">
      {/* Background gradient orbs */}
      <div className="absolute top-1/3 left-1/3 w-[28rem] h-[28rem] bg-purple-600/20 blur-[140px] rounded-full" />
      <div className="absolute bottom-1/3 right-1/4 w-[24rem] h-[24rem] bg-blue-600/20 blur-[140px] rounded-full" />

      {/* Back Button */}
      <button
        onClick={() => router.push("/signin")}
        className="absolute top-8 left-8 flex items-center gap-2 text-gray-400 hover:text-white transition-all"
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-4xl text-center"
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-12 h-12 bg-gradient-to-r from-[#5b47ff] to-[#9b59ff] rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Teamify.AI
          </h1>
        </div>

        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          Choose Your Path
        </h1>
        <p className="text-gray-400 mt-3 text-lg mb-10">
          Create a new team or join one using an invite code
        </p>

        {/* Options */}
        <div className="grid sm:grid-cols-2 gap-6 sm:gap-10 mt-10">
          {[
            {
              href: "/team/create-team",
              title: "Create a New Team",
              desc: "Start fresh and lead your hackathon project",
              icon: <UserPlus size={30} className="text-white" />,
              color: "from-purple-600 to-indigo-600",
              text: "text-purple-400",
              index: 0,
            },
            {
              href: "/team/join-team",
              title: "Join Existing Team",
              desc: "Enter a team code and start collaborating",
              icon: <Users size={30} className="text-white" />,
              color: "from-blue-600 to-purple-600",
              text: "text-blue-400",
              index: 1,
            },
          ].map((card) => (
            <motion.div
              key={card.title}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              custom={card.index}
            >
              <Link href={card.href}>
                <div
                  className={`group p-8 rounded-2xl bg-[#101626]/80 border border-white/10 hover:border-purple-400/40 hover:shadow-[0px_0px_25px_rgba(120,50,255,0.25)] transition-all backdrop-blur-md`}
                >
                  <div
                    className={`w-16 h-16 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mx-auto group-hover:scale-110 transition`}
                  >
                    {card.icon}
                  </div>

                  <h2 className="text-2xl font-semibold mt-5">{card.title}</h2>
                  <p className="text-gray-400 text-sm mt-2">{card.desc}</p>

                  <div
                    className={`flex justify-center items-center mt-5 ${card.text} font-medium gap-1`}
                  >
                    Continue
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
