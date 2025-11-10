"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Users,
  MessageSquare,
  Sparkles,
  Folder,
  Bell,
  Settings,
  X,
  Zap,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Team", href: "/dashboard/team", icon: Users },
  { name: "Chat", href: "/dashboard/chat", icon: MessageSquare },
  { name: "AI Tools", href: "/dashboard/ai-tools", icon: Sparkles },
  { name: "Files", href: "/dashboard/files", icon: Folder },
  { name: "Notifications", href: "/dashboard/notifications", icon: Bell },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function Sidebar({
  open,
  onClose,
}: {
  open?: boolean;
  onClose?: () => void;
}) {
  const pathname = usePathname();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const name = localStorage.getItem("userName");
    if (name) setUserName(name);
  }, []);

  return (
    <>
      {/* ─── Desktop Sidebar ─── */}
      <aside className="hidden md:flex flex-col fixed left-0 top-0 w-64 h-full bg-[#0a0f1a] border-r border-white/10 z-40">
        <div className="flex items-center gap-2 px-6 py-6 border-b border-white/10">
          <div className="w-10 h-10 bg-gradient-to-r from-[#5b47ff] to-[#9b59ff] rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <span className="text-white font-bold text-xl">Teamify.AI</span>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          {links.map(({ name, href, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={name}
                href={href}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-gray-400 transition-all",
                  active
                    ? "bg-[#111827] text-white shadow-lg shadow-indigo-500/20"
                    : "hover:bg-[#111827]/50 hover:text-white"
                )}
              >
                <Icon
                  className={cn(
                    "w-5 h-5",
                    active ? "text-[#9b59ff]" : "text-gray-400"
                  )}
                />
                <span className="font-medium">{name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="px-4 py-3 border-t border-white/10">
          <Link
            href="/dashboard/settings"
            className={cn(
              "flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#111827]/50 transition-all",
              pathname === "/dashboard/settings" &&
                "bg-[#111827] text-white"
            )}
          >
            <User className="w-5 h-5" />
            <span className="font-medium">{userName || "User"}</span>
          </Link>
        </div>
      </aside>

      {/* ─── Mobile Sidebar ─── */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={onClose}
        >
          <aside
            className="absolute left-0 top-0 w-64 h-full bg-[#0a0f1a] border-r border-white/10 p-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 bg-gradient-to-r from-[#5b47ff] to-[#9b59ff] rounded-xl flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-white font-semibold text-lg">
                  Teamify.AI
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-md transition"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            <nav className="flex flex-col gap-1">
              {links.map(({ name, href, icon: Icon }) => {
                const active = pathname === href;
                return (
                  <Link
                    key={name}
                    href={href}
                    onClick={onClose}
                    className={cn(
                      "flex items-center gap-3 px-4 py-2 rounded-lg text-gray-400 transition-all",
                      active
                        ? "bg-[#111827] text-white shadow-md shadow-indigo-500/20"
                        : "hover:bg-[#111827]/50 hover:text-white"
                    )}
                  >
                    <Icon
                      className={cn(
                        "w-5 h-5",
                        active ? "text-[#9b59ff]" : "text-gray-400"
                      )}
                    />
                    <span className="font-medium">{name}</span>
                  </Link>
                );
              })}
            </nav>
          </aside>
        </div>
      )}
    </>
  );
}
