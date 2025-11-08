"use client";

import { useState, useRef, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { motion } from "framer-motion";
import { Send, FileUp, Smile, User2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

export default function ChatPage() {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [messages, setMessages] = useState<
        { senderName: string; from: "you" | "team"; text: string }[]
    >([]);

    const [input, setInput] = useState("");
    const [teamId, setTeamId] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    // ✅ Load old messages
    const fetchMessages = async () => {
        const token = localStorage.getItem("token");
        const team = localStorage.getItem("teamId");
        if (!team || !token) return;

        const res = await fetch(`http://localhost:5000/api/chat/${team}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (data.messages) {
            const formatted = data.messages.map((m: any) => ({
                senderName: m.senderName,
                text: m.text,
                from: m.senderName === localStorage.getItem("userName") ? "you" : "team"
            }));
            setMessages(formatted);
        }
    };


    // ✅ Initialize socket
    useEffect(() => {
        const newSocket = io("http://localhost:5000", {
            transports: ["websocket", "polling"],
            withCredentials: true,
        });
        setSocket(newSocket);

        newSocket.on("connect", () => {
            console.log("🟢 Connected:", newSocket.id);
        });

        return () => {
            newSocket.disconnect();
        };
    }, []);

    // ✅ Get teamId
    useEffect(() => {
        const stored = localStorage.getItem("teamId");
        if (stored) setTeamId(stored);
    }, []);

    // ✅ Join team + listen messages
    useEffect(() => {
        if (!socket || !teamId) return;

        socket.emit("join_team", teamId);
        console.log("✅ Joined Team:", teamId);

        fetchMessages();

        socket.on("receive_message", (msg) => {
            setMessages((prev) => [
                ...prev,
                {
                    senderName: msg.senderName,
                    text: msg.text,
                    from: m.senderName === localStorage.getItem("userName") ? "you" : "team"

                }
            ]);
        });

        return () => {
            socket.off("receive_message");
        };
    }, [socket, teamId]);


    // ✅ Send message
    const sendMessage = async () => {
        if (!input.trim() || !teamId || !socket) return;

        const msgData = {
            teamId,
            text: input,
            senderName: localStorage.getItem("userName"),
        };

        // ✅ Save to DB
        const token = localStorage.getItem("token");
        await fetch(`http://localhost:5000/api/chat/${teamId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(msgData),
        });

        // ✅ Emit socket
        socket.emit("send_message", {
            teamId: localStorage.getItem("teamId"), // ✅ objectId bhejo
            senderName: localStorage.getItem("userName"),
            text: input
        });


        setInput("");
    };

    // ✅ Send file
    const sendFile = (e: any) => {
        const file = e.target.files[0];
        if (!file || !teamId || !socket) return;

        const name = localStorage.getItem("userName") || "Unknown";

        socket.emit("send_message", {
            teamId,
            text: `📎 File: ${file.name}`,
            senderId: socket.id,
            senderName: name,
        });

        setMessages((prev) => [
            ...prev,
            { senderName: name, text: `📎 File: ${file.name}`, from: "you" }
        ]);
    };

    // ✅ UI
    return (
        <div className="h-[100dvh] w-full flex flex-col bg-gradient-to-br from-[#020617] via-[#0b0f26] to-[#1e1b4b] text-white p-6">
            <h1 className="text-2xl font-bold mb-4">Team Chat</h1>

            <div className="flex-1 overflow-y-auto space-y-3 p-4 rounded-xl bg-black/20 border border-white/10">
                {messages.map((msg, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: msg.from === "you" ? 40 : -40 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={cn(
                            "max-w-[75%] p-3 rounded-xl text-sm",
                            msg.from === "you" ? "ml-auto bg-blue-600" : "bg-black/40 border border-gray-700"
                        )}
                    >
                        <div className="flex items-center gap-1 mb-1">
                            {msg.from === "you" ? <User2 className="w-4 h-4" /> : <Users className="w-4 h-4 text-purple-400" />}
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
                <input type="file" ref={fileInputRef} className="hidden" onChange={sendFile} />

                <div className="relative">
                    <button onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                        <Smile className="w-6 h-6 text-gray-300 hover:text-purple-400" />
                    </button>
                    {showEmojiPicker && (
                        <div className="absolute bottom-12">
                            <Picker data={data} onEmojiSelect={(e: any) => setInput(input + e.native)} theme="dark" />
                        </div>
                    )}
                </div>

                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-1 bg-transparent outline-none"
                    placeholder="Type a message..."
                />

                <Button onClick={sendMessage} className="bg-purple-700 hover:bg-purple-500">
                    <Send className="w-5 h-5" />
                </Button>
            </div>
        </div>
    );
}
