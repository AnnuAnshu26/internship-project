"use client";

import Sidebar from "@/app/commonComponents/SideBar";
import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex">
      {/* Sidebar stays fixed */}
      <Sidebar />

      {/* Page changes here */}
      <div className="flex-1 ml-0 md:ml-64">
        {children}
      </div>
    </div>
  );
}
