"use client";

import { useState, useRef, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { motion } from "framer-motion";
import { Send, FileUp, Smile, User2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

// ✅ Safe base URL (handles both Render + Localhost)
const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:5000";
console.log("🌍 API_BASE =", API_BASE);

type MessageType = {
  senderName: string;
  from: "you" | "team";
  text: string;
};

export default function ChatPage() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [input, setInput] = useState("");
  const [teamId, setTeamId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const [summary, setSummary] = useState("");
  const [loadingSummary, setLoadingSummary] = useState(false);

  const recentMessages = useRef(new Set<string>());
  const makeMsgKey = (name: string, text: string) => `${name}:${text}`;

  // ✅ Generate AI chat summary
  const generateSummary = async () => {
    if (messages.length === 0) return;
    setLoadingSummary(true);
    try {
      const res = await fetch(`${API_BASE}/api/ai/summary`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chats: messages }),
      });

      const data = await res.json();
      setSummary(data.summary || "No summary generated.");
    } catch (err) {
      console.error("Summary error", err);
    } finally {
      setLoadingSummary(false);
    }
  };

  // ✅ Fetch chat history
  const fetchMessages = async () => {
    const token = localStorage.getItem("token");
    const team = localStorage.getItem("teamId");
    if (!team || !token) return;

    try {
      const res = await fetch(`${API_BASE}/api/chat/${team}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (data.messages) {
        const formatted: MessageType[] = [];
        for (let m of data.messages) {
          const key = makeMsgKey(m.senderName, m.text);
          if (recentMessages.current.has(key)) continue;
          recentMessages.current.add(key);
          formatted.push({
            senderName: m.senderName,
            text: m.text,
            from:
              m.senderName === localStorage.getItem("userName")
                ? "you"
                : "team",
          });
        }
        setMessages(formatted);
      }
    } catch (err) {
      console.error("Fetch messages error:", err);
    }
  };

  // ✅ Setup WebSocket (Render + Local)
  useEffect(() => {
    const newSocket = io(API_BASE, {
      transports: ["websocket", "polling"],
      secure: API_BASE.startsWith("https"),
    });

    setSocket(newSocket);
    newSocket.on("connect", () => console.log("🟢 Connected:", newSocket.id));

    newSocket.on("receive_message", (msg: any) => {
      const key = makeMsgKey(msg.senderName, msg.text);
      if (recentMessages.current.has(key)) return;
      recentMessages.current.add(key);
      setMessages((prev) => [
        ...prev,
        {
          senderName: msg.senderName,
          text: msg.text,
          from:
            msg.senderName === localStorage.getItem("userName")
              ? "you"
              : "team",
        },
      ]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // ✅ Load teamId and join room
  useEffect(() => {
    const stored = localStorage.getItem("teamId");
    if (stored) setTeamId(stored);
  }, []);

  useEffect(() => {
    if (!socket || !teamId) return;
    socket.emit("join_team", teamId);
    fetchMessages();
  }, [socket, teamId]);

  // ✅ Send message
  const sendMessage = async () => {
    if (!input.trim() || !teamId || !socket) return;

    const senderName = localStorage.getItem("userName") || "Unknown";
    const key = makeMsgKey(senderName, input);

    if (!recentMessages.current.has(key)) {
      recentMessages.current.add(key);
      setMessages((prev) => [...prev, { senderName, text: input, from: "you" }]);
    }

    const token = localStorage.getItem("token");
    await fetch(`${API_BASE}/api/chat/${teamId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ teamId, text: input, senderName }),
    });

    socket.emit("send_message", { teamId, senderName, text: input });
    setInput("");
  };

  // ✅ Send file as chat message
  const sendFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !teamId || !socket) return;

    const name = localStorage.getItem("userName") || "Unknown";
    const fileMsg = `📎 File: ${file.name}`;
    const key = makeMsgKey(name, fileMsg);

    if (!recentMessages.current.has(key)) {
      recentMessages.current.add(key);
      setMessages((prev) => [
        ...prev,
        { senderName: name, text: fileMsg, from: "you" },
      ]);
    }

    socket.emit("send_message", { teamId, text: fileMsg, senderName: name });
  };

  // ✅ UI
  return (
    <div className="h-[100dvh] w-full flex flex-col bg-gradient-to-br from-[#020617] via-[#0b0f26] to-[#1e1b4b] text-white p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Team Chat</h1>
        <Button
          onClick={generateSummary}
          disabled={loadingSummary}
          className="bg-purple-500 hover:bg-purple-600 text-white"
        >
          {loadingSummary ? "Generating..." : "Summarize Chat"}
        </Button>
      </div>

      {summary && (
        <div className="p-3 bg-black/30 border border-purple-700 rounded-md text-sm mb-4">
          ✨ <b>Chat Summary:</b>
          <p className="mt-1 whitespace-pre-line">{summary}</p>
        </div>
      )}

      <div className="flex-1 overflow-y-auto space-y-3 p-4 rounded-xl bg-black/20 border border-white/10">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: msg.from === "you" ? 40 : -40 }}
            animate={{ opacity: 1, x: 0 }}
            className={cn(
              "max-w-[75%] p-3 rounded-xl text-sm",
              msg.from === "you"
                ? "ml-auto bg-blue-600"
                : "bg-black/40 border border-gray-700"
            )}
          >
            <div className="flex items-center gap-1 mb-1">
              {msg.from === "you" ? (
                <User2 className="w-4 h-4" />
              ) : (
                <Users className="w-4 h-4 text-purple-400" />
              )}
              <span className="text-xs font-semibold">{msg.senderName}</span>
            </div>
            <p>{msg.text}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-3 px-4 py-3 rounded-xl bg-black/20 border border-white/10">
        <button onClick={() => fileInputRef.current?.click()}>
          <FileUp className="w-6 h-6 text-gray-300 hover:text-purple-400" />
        </button>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={sendFile}
        />

        <div className="relative">
          <button onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
            <Smile className="w-6 h-6 text-gray-300 hover:text-purple-400" />
          </button>
          {showEmojiPicker && (
            <div className="absolute bottom-12">
              <Picker
                data={data}
                onEmojiSelect={(e: any) =>
                  setInput((prev) => prev + e.native)
                }
                theme="dark"
              />
            </div>
          )}
        </div>

        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-transparent outline-none"
          placeholder="Type a message..."
        />

        <Button
          onClick={sendMessage}
          className="bg-purple-700 hover:bg-purple-500"
        >
          <Send className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
