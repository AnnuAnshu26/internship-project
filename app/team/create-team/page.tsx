"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Plus, Check, Copy } from "lucide-react";
import { toast } from "sonner";

export default function CreateTeamPage() {
    const [teamName, setTeamName] = useState("");
    const [loading, setLoading] = useState(false);
    const [teamId, setTeamId] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const handleCreateTeam = async () => {
        if (!teamName.trim()) {
            toast.error("Team name is required");
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Please login first");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("http://localhost:5000/api/team/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ name: teamName }),
            });

            const data = await res.json();
            console.log("API response:", data);

            if (!res.ok) {
                throw new Error(data.message || "Failed to create team");
            }

setTeamId(data.team._id); // ✅ Mongo ID save karo
localStorage.setItem("teamId", data.team._id);
localStorage.setItem("teamCode", data.team.teamCode);

            toast.success("Team created successfully!");
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        if (!teamId) return;
        navigator.clipboard.writeText(teamId);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    return (
        <div className="min-h-screen bg-[#0a0f1a] flex items-center justify-center px-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-sm sm:max-w-md bg-[#101626]/60 backdrop-blur-lg border border-white/10 rounded-2xl p-6 sm:p-8 text-white shadow-lg"
            >

                {!teamId ? (
                    /* ---- TEAM CREATION FORM ---- */
                    <>
                        <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                            Create Team
                        </h1>
                        <p className="text-gray-400 text-center text-sm mt-1">
                            Start your new hackathon project
                        </p>

                        <div className="mt-8 space-y-6">
                            <div>
                                <label className="text-sm text-gray-300">Team Name</label>
                                <input
                                    className="w-full mt-2 p-4 bg-[#0c111c] rounded-lg border border-white/10 outline-none focus:border-purple-600 transition"
                                    placeholder="Enter team name"
                                    value={teamName}
                                    onChange={(e) => setTeamName(e.target.value)}
                                />
                            </div>

                            <button
                                onClick={handleCreateTeam}
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 mt-4 py-3 rounded-xl flex justify-center items-center gap-2 font-medium hover:scale-[1.02] transition"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : <Plus />}
                                {loading ? "Creating..." : "Create Team"}
                            </button>
                        </div>
                    </>
                ) : (
                    /* ---- SUCCESS + TEAM CODE SECTION ---- */
                    <div className="text-center">
                        <motion.div
                            initial={{ scale: 0.6 }}
                            animate={{ scale: 1 }}
                            className="w-16 h-16 mx-auto bg-green-500/20 rounded-full flex items-center justify-center mb-4"
                        >
                            <Check className="w-8 h-8 text-green-400" />
                        </motion.div>

                        <h2 className="text-2xl font-semibold">Team Created Successfully!</h2>
                        <p className="text-gray-400 text-sm mt-1">
                            Share this code with your teammates to join
                        </p>

                        {/* CODE BOX */}
                        <div className="mt-6 flex items-center justify-between bg-[#0c111c] border border-white/10 px-4 py-3 rounded-lg">
                            <span className="font-mono text-lg tracking-wide">{teamId}</span>
                            <button onClick={handleCopy} className="p-2 hover:bg-white/10 rounded-md transition">
                                {copied ? <Check className="text-green-400" size={20} /> : <Copy size={20} />}
                            </button>
                        </div>

                        {copied && (
                            <p className="text-green-400 text-sm mt-2">Copied to clipboard!</p>
                        )}

                        <button
                            onClick={() => (window.location.href = "/dashboard")}
                            className="mt-6 w-full bg-gradient-to-r from-blue-600 to-purple-600 py-3 rounded-xl font-medium hover:scale-[1.02] transition"
                        >
                            Go to Dashboard
                        </button>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
