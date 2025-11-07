"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Send,
    FileUp,
    Smile,
    Sparkles,
    User2,
    Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";


export default function ChatPage() {
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const [messages, setMessages] = useState<
        { sender: string; from: "you" | "team"; text: string }[]
    >([
        { sender: "Aman", from: "team", text: "Hey team! Are we finalising the project idea today?" },
        { sender: "Riya", from: "team", text: "Yes, I think we should focus on the AI automation part 👀" },
        { sender: "Kabir", from: "team", text: "Agreed, also UI needs to be clean & hackathon-ready!" },
        { sender: "Ananya", from: "team", text: "I can handle UI, just share the flow 🎨" },
        { sender: "You", from: "you", text: "Sure, let's discuss and finalise here" },
    ]);

    const [input, setInput] = useState("");
    const [showSummaryBox, setShowSummaryBox] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const sendMessage = () => {
        if (!input.trim()) return;
        setMessages([...messages, { sender: "You", from: "you", text: input }]);
        setInput("");
    };

    const sendFile = (event: any) => {
        const file = event.target.files[0];
        if (!file) return;
        setMessages([...messages, { sender: "You", from: "you", text: `📎 File shared: ${file.name}` }]);
    };

    const summariseChat = () => {
        setShowSummaryBox(true);
        setTimeout(() => setShowSummaryBox(false), 1800);
    };

    return (
        <div className="h-[100dvh] w-full flex flex-col bg-gradient-to-br from-[#020617] via-[#0b0f26] to-[#1e1b4b] text-white p-3 sm:p-4 md:p-6">

            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4 md:mb-6">
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold">Team Chat</h1>
                <Button
                    className="flex items-center gap-1 sm:gap-2 text-sm sm:text-base bg-gradient-to-r from-purple-400 to-blue-400 hover:opacity-90"
                    onClick={summariseChat}
                >
                    <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
                    Summarize Chat
                </Button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto space-y-3 p-3 sm:p-4 rounded-xl bg-black/20 border border-white/10">
                {messages.map((msg, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: msg.from === "you" ? 40 : -40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className={cn(
                            "max-w-[85%] sm:max-w-[75%] p-2 sm:p-3 rounded-xl text-xs sm:text-sm",
                            msg.from === "you" ? "ml-auto bg-blue-600" : "bg-black/40 border border-gray-700"
                        )}
                    >
                        <div className="flex items-center gap-1 mb-1">
                            {msg.from === "you" ? (
                                <User2 className="w-3 h-3 sm:w-4 sm:h-4 text-white opacity-70" />
                            ) : (
                                <Users className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400 opacity-70" />
                            )}
                            <span className="text-[10px] sm:text-xs font-semibold opacity-80">{msg.sender}</span>
                        </div>
                        <p>{msg.text}</p>
                    </motion.div>
                ))}
            </div>

            {/* Input */}
            <div className="mt-3 sm:mt-4 flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-xl bg-black/20 border border-white/10">
                <button onClick={() => fileInputRef.current?.click()}>
                    <FileUp className="w-5 h-5 sm:w-6 sm:h-6 text-gray-300 hover:text-purple-400" />
                </button>
                <input type="file" ref={fileInputRef} className="hidden" onChange={sendFile} />

                <div className="relative">
                    <button onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                        <Smile className="w-5 h-5 sm:w-6 sm:h-6 text-gray-300 hover:text-purple-400" />
                    </button>

                    {/* Emoji Picker Popover */}
                    {showEmojiPicker && (
                        <div className="absolute bottom-12 left-0 z-50 scale-[0.8] sm:scale-100 origin-bottom-left">
                            <Picker
                                data={data}
                                onEmojiSelect={(emoji: any) => {
                                    setInput(input + emoji.native);
                                    setShowEmojiPicker(false);
                                }}
                                theme="dark"
                            />
                        </div>
                    )}
                </div>


                <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 bg-transparent outline-none text-white text-xs sm:text-sm md:text-base px-2"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />

                <Button onClick={sendMessage} className="bg-purple-700 hover:bg-purple-500 px-3 sm:px-4 py-2 text-white">
                    <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
            </div>

            {/* Summarising Popup */}
            <AnimatePresence>
                {showSummaryBox && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.7 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.6 }}
                        className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                    >
                        <div className="px-4 py-3 sm:px-6 sm:py-4 bg-[#111] border border-purple-500/50 rounded-xl shadow-xl max-w-[90%] sm:max-w-xs">
                            <p className="text-purple-300 font-medium flex items-center gap-2 text-xs sm:text-sm md:text-base">
                                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" /> Summarising chat...
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
}
