"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, SendHorizonal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

// ✅ Always use a single, clean API base
const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:5000";
console.log("🌍 AI Tools API_BASE =", API_BASE);

export default function AITools() {
  const [pitchInput, setPitchInput] = useState("");
  const [pitchResult, setPitchResult] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState([
    {
      from: "ai",
      text: "Hey! Ask me anything about your hackathon idea 😊. I am here to help!",
    },
  ]);
  const [userInput, setUserInput] = useState("");

  // ✅ Generate Pitch
  const generatePitch = async () => {
    if (!pitchInput.trim()) return toast.error("Enter some points first!");

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/ai/generate-pitch`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: pitchInput }),
      });

      if (!res.ok) throw new Error("Pitch generation failed");
      const data = await res.json();
      setPitchResult(data.reply || "No pitch generated.");
      toast.success("Pitch generated successfully!");
    } catch (err) {
      toast.error("Error generating pitch");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ AI Chat Assistant
  const sendMessage = async () => {
    if (!userInput.trim()) return;

    const userMsg = { from: "user", text: userInput };
    setMessages((m) => [...m, userMsg]);
    setUserInput("");

    try {
      const res = await fetch(`${API_BASE}/api/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userInput }),
      });

      if (!res.ok) throw new Error("Chat request failed");
      const data = await res.json();
      setMessages((m) => [...m, { from: "ai", text: data.reply }]);
    } catch (err) {
      setMessages((m) => [
        ...m,
        { from: "ai", text: "⚠️ I couldn’t process that. Please try again!" },
      ]);
      console.error("AI chat error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#0b0f26] to-[#1e1b4b] text-white p-6 flex flex-col">
      <h1 className="text-3xl font-bold mb-6 text-center">
        ⚡ AI-Powered Hackathon Tools
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 🧠 Pitch Generator */}
        <Card className="bg-[#0f1231]/70 p-6 rounded-2xl border border-[#3b82f6]/20">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Sparkles className="text-purple-400" /> AI Pitch Generator
          </h2>

          <textarea
            placeholder="Enter:
• Problem
• Solution
• Features
• Target audience..."
            value={pitchInput}
            onChange={(e) => setPitchInput(e.target.value)}
            className="w-full bg-black/30 border border-gray-700 p-3 rounded-lg h-40 outline-none"
          />

          <Button
            onClick={generatePitch}
            disabled={loading}
            className="mt-4 w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90"
          >
            {loading ? "Generating..." : "Generate Pitch 🚀"}
          </Button>

          {pitchResult && (
            <div className="mt-4 bg-black/40 p-4 rounded-lg border border-gray-700 whitespace-pre-wrap text-sm max-h-[300px] overflow-auto">
              {pitchResult}
            </div>
          )}
        </Card>

        {/* 💬 AI Chat Assistant */}
        <Card className="bg-[#0f1231]/70 p-6 rounded-2xl border border-[#3b82f6]/20 flex flex-col">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Sparkles className="text-purple-400" /> AI Assistant
          </h2>

          <div className="flex flex-col gap-3 overflow-y-auto h-[350px] pr-2">
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                className={`p-3 rounded-lg max-w-[75%] ${
                  msg.from === "user"
                    ? "ml-auto bg-blue-600"
                    : "bg-black/40 border border-gray-700"
                }`}
              >
                {msg.text}
              </motion.div>
            ))}
          </div>

          <div className="flex gap-2 mt-4">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Ask anything..."
              className="flex-1 bg-black/30 px-3 py-2 border border-gray-700 rounded-lg outline-none"
            />
            <Button onClick={sendMessage} className="bg-purple-600 hover:bg-purple-700 p-2">
              <SendHorizonal />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
