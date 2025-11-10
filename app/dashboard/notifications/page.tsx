"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  FileText,
  Zap,
  BellRing,
  UserPlus,
  Clock,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ✅ Safe backend URL (no trailing slash issue)
const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:5000";
console.log("🔔 Notifications API_BASE =", API_BASE);

type NotificationItem = {
  _id: string;
  title: string;
  subtitle: string;
  type: "task" | "file" | "ai" | "deadline" | "join" | "info";
  read?: boolean;
  createdAt?: string;
};

function IconByType({ type }: { type: NotificationItem["type"] }) {
  switch (type) {
    case "task":
      return <CheckCircle className="w-5 h-5 text-green-400" />;
    case "file":
      return <FileText className="w-5 h-5 text-indigo-400" />;
    case "ai":
      return <Zap className="w-5 h-5 text-purple-400" />;
    case "deadline":
      return <Clock className="w-5 h-5 text-yellow-400" />;
    case "join":
      return <UserPlus className="w-5 h-5 text-blue-300" />;
    default:
      return <BellRing className="w-5 h-5 text-gray-300" />;
  }
}

export default function NotificationsPage() {
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);

  const teamId =
    typeof window !== "undefined" ? localStorage.getItem("teamId") : null;
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // ✅ Fetch notifications
  const fetchNotifications = async () => {
    if (!teamId || !token) return;
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/notifications/${teamId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch notifications");

      const data = await res.json();
      setItems(data.notifications || []);
    } catch (err) {
      console.error("❌ Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // ✅ Mark all as read
  const markAllRead = async () => {
    if (!teamId || !token) return;
    try {
      const res = await fetch(`${API_BASE}/api/notifications/mark-read`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ teamId }),
      });

      if (!res.ok) throw new Error("Failed to mark all read");

      setItems((prev) => prev.map((it) => ({ ...it, read: true })));
    } catch (err) {
      console.error("❌ Error marking notifications:", err);
    }
  };

  // ✅ Dismiss single notification locally
  const dismissNotification = (id: string) => {
    setItems((prev) => prev.filter((it) => it._id !== id));
  };

  // ✅ Mark single as read (local only)
  const toggleRead = (id: string) => {
    setItems((prev) =>
      prev.map((it) => (it._id === id ? { ...it, read: true } : it))
    );
  };

  const unreadCount = items.filter((i) => !i.read).length;

  return (
    <div className="min-h-screen bg-[#0a0f1a] text-white p-4 sm:p-6 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Notifications</h1>
            <p className="text-gray-400 mt-1">
              Stay updated with your team's activities
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-2 bg-[#0f1523] px-4 py-2 rounded-xl border border-white/10">
              <span className="text-sm text-gray-300">
                {unreadCount} unread
              </span>
            </div>

            <button
              onClick={markAllRead}
              disabled={loading}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 rounded-xl text-sm font-medium hover:scale-[1.02] transition"
            >
              <Check className="w-4 h-4" />
              {loading ? "Marking..." : "Mark all as read"}
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
                className={cn(
                  "flex items-start gap-4 p-4 rounded-xl border border-white/10",
                  !item.read
                    ? "bg-gradient-to-r from-[#0f1220]/60 to-[#0c1020]/40 shadow-lg"
                    : "bg-[#0f1220]/40"
                )}
                onClick={() => toggleRead(item._id)}
                role="button"
              >
                {/* Icon */}
                <div className="flex-shrink-0 w-11 h-11 rounded-lg flex items-center justify-center bg-black/40 border border-white/10">
                  <IconByType type={item.type} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <h3
                        className={cn(
                          "font-medium truncate",
                          !item.read ? "text-white" : "text-gray-200"
                        )}
                      >
                        {item.title}
                      </h3>
                      {!item.read && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-purple-700/40 text-purple-200">
                          New
                        </span>
                      )}
                    </div>

                    <span className="text-xs text-gray-400 whitespace-nowrap">
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleString()
                        : ""}
                    </span>
                  </div>

                  <p className="text-sm text-gray-300 mt-1 truncate">
                    {item.subtitle}
                  </p>
                </div>

                {/* Dismiss Button */}
                <div className="flex-shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      dismissNotification(item._id);
                    }}
                    className="text-xs text-gray-400 hover:text-white px-2 py-1 rounded-md"
                  >
                    Dismiss
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Empty state */}
          {items.length === 0 && !loading && (
            <div className="text-center py-12 bg-[#0f1523] rounded-xl border border-white/10">
              <BellRing className="mx-auto mb-3 text-gray-400 w-8 h-8" />
              <p className="text-gray-300">
                No notifications — you’re all caught up 🎉
              </p>
            </div>
          )}

          {loading && (
            <p className="text-gray-400 text-center mt-6 animate-pulse">
              Loading notifications...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
