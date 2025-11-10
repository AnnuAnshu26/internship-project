"use client";

import Sidebar from "@/app/commonComponents/SideBar";
import { ReactNode, useState } from "react";
import { Menu } from "lucide-react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#0A0F1A] text-white">
      {/* ─── Sidebar ─── */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* ─── Mobile Header ─── */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-[#0A0F1A] border-b border-white/10 flex items-center justify-between px-4 py-3">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-md hover:bg-white/10 transition"
        >
          <Menu className="w-6 h-6 text-white" />
        </button>
        <h1 className="font-semibold text-lg">Dashboard</h1>
      </div>

      {/* ─── Page Content ─── */}
      <div
        className={`flex-1 transition-all duration-300 ${
          sidebarOpen ? "md:ml-64" : "ml-0 md:ml-64"
        } p-4 md:p-8 pt-16 md:pt-6`}
      >
        {children}
      </div>
    </div>
  );
}
