"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Home,
  Users,
  MessageSquare,
  Sparkles,
  Folder,
  Bell,
  Settings,
  Menu,
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

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [userName, setUserName] = useState("");
  useState(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setUserName(JSON.parse(user).name);
    }
  }, []);


  return (
    <>
      {/* Mobile Topbar + Toggle Button */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-[#0a0f1a] border-b border-white/10 fixed top-0 left-0 w-full z-50">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-gradient-to-r from-[#5b47ff] to-[#9b59ff] rounded-xl flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-white font-semibold text-lg">Teamify.AI</span>
        </div>

        <button onClick={() => setOpen(!open)}>
          {open ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-screen w-64 bg-[#0a0f1a] border-r border-white/10 flex flex-col z-50 transition-transform duration-300",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 px-6 py-6 mt-2">
          <div className="w-10 h-10 bg-gradient-to-r from-[#5b47ff] to-[#9b59ff] rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <span className="text-white font-bold text-xl">Teamify.AI</span>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          {links.map(({ name, href, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={name}
                href={href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-gray-400 transition-all",
                  active
                    ? "bg-[#111827] text-white shadow-lg shadow-indigo-500/20"
                    : "hover:bg-[#111827]/50 hover:text-white"
                )}
              >
                <Icon className={cn("w-5 h-5", active ? "text-[#9b59ff]" : "text-gray-400")} />
                <span className="font-medium">{name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Settings */}
        <div className="px-4 py-2 border-t border-white/10">
          <Link
            href="/dashboard/settings"
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#111827]/50 transition-all",
              pathname === "/settings" && "bg-[#111827] text-white"
            )}
          >
            <User className="w-5 h-5" />
            <span className="font-medium">{userName || "User"}</span>
          </Link>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm lg:hidden z-40"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}
