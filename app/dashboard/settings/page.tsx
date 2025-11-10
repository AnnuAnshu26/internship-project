"use client";

import { useState, useEffect } from "react";
import { User, Bell, Shield } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function SettingsPage() {
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    bio: "",
    avatarUrl: "",
  });

  const [preferences, setPreferences] = useState({
    email: true,
    push: true,
    teamUpdates: true,
    aiSuggestions: false,
  });

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const [loading, setLoading] = useState(false);
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // ✅ Fetch user profile
  const fetchProfile = async () => {
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        console.warn("No /api/auth/me endpoint found — skipping fetch");
        return;
      }

      const data = await res.json();
      if (data.user) {
        setProfile({
          firstName: data.user.firstName || "",
          lastName: data.user.lastName || "",
          email: data.user.email || "",
          bio: data.user.bio || "",
          avatarUrl:
            data.user.avatarUrl ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              data.user.firstName + " " + data.user.lastName
            )}&background=random&color=fff&rounded=true&size=128`,
        });
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // ✅ Update profile info
  const handleSaveProfile = async () => {
    if (!token) return toast.error("Please log in first");

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/auth/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profile),
      });

      if (res.ok) toast.success("Profile updated successfully!");
      else toast.error("Failed to update profile");
    } catch (err) {
      toast.error("Error saving profile");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Save preferences locally for now (you can later add API route)
  const savePreferences = () => {
    localStorage.setItem("preferences", JSON.stringify(preferences));
    toast.success("Preferences saved!");
  };

  // ✅ Change password
  const updatePassword = async () => {
    if (!token) return toast.error("Please log in first");
    if (passwords.new !== passwords.confirm)
      return toast.error("New passwords do not match");

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwords.current,
          newPassword: passwords.new,
        }),
      });

      if (res.ok) {
        toast.success("Password updated successfully!");
        setPasswords({ current: "", new: "", confirm: "" });
      } else {
        const errText = await res.text();
        toast.error(errText || "Failed to update password");
      }
    } catch (err) {
      toast.error("Error updating password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0F1A] text-white p-6 flex flex-col gap-10">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-gray-400 mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      {/* ▓▓▓ PROFILE SECTION ▓▓▓ */}
      <div className="bg-[#0F1523] rounded-xl border border-white/10 p-6 space-y-5">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <User size={18} /> Profile Information
        </h2>

        <div className="flex items-center gap-6">
          <Image
            src={
              profile.avatarUrl ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                profile.firstName + " " + profile.lastName
              )}&background=random&color=fff`
            }
            width={80}
            height={80}
            alt="Profile avatar"
            unoptimized
            className="rounded-full"
          />
          <button
            className="border border-white/20 px-4 py-2 rounded-lg hover:bg-white/10 transition text-sm"
            onClick={() => toast.info("Profile photo upload coming soon!")}
          >
            Upload New Photo
          </button>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <TextInput
            label="First Name"
            value={profile.firstName}
            onChange={(v) => setProfile({ ...profile, firstName: v })}
          />
          <TextInput
            label="Last Name"
            value={profile.lastName}
            onChange={(v) => setProfile({ ...profile, lastName: v })}
          />
        </div>

        <TextInput label="Email" value={profile.email} disabled />
        <TextArea
          label="Bio"
          value={profile.bio}
          onChange={(v) => setProfile({ ...profile, bio: v })}
          placeholder="Write about yourself..."
        />

        <ActionButton
          onClick={handleSaveProfile}
          text={loading ? "Saving..." : "Save Changes"}
        />
      </div>

      {/* ▓▓▓ NOTIFICATIONS SECTION ▓▓▓ */}
      <div className="bg-[#0F1523] rounded-xl border border-white/10 p-6 space-y-5">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Bell size={18} /> Notification Preferences
        </h2>

        {Object.entries(preferences).map(([key, value]) => (
          <ToggleRow
            key={key}
            title={key.replace(/([A-Z])/g, " $1")}
            enabled={value}
            onChange={() =>
              setPreferences((p) => ({ ...p, [key]: !p[key as keyof typeof p] }))
            }
          />
        ))}

        <ActionButton onClick={savePreferences} text="Save Preferences" />
      </div>

      {/* ▓▓▓ SECURITY SECTION ▓▓▓ */}
      <div className="bg-[#0F1523] rounded-xl border border-white/10 p-6 space-y-5">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Shield size={18} /> Security Settings
        </h2>

        <TextInput
          label="Current Password"
          type="password"
          value={passwords.current}
          onChange={(v) => setPasswords({ ...passwords, current: v })}
        />
        <TextInput
          label="New Password"
          type="password"
          value={passwords.new}
          onChange={(v) => setPasswords({ ...passwords, new: v })}
        />
        <TextInput
          label="Confirm New Password"
          type="password"
          value={passwords.confirm}
          onChange={(v) => setPasswords({ ...passwords, confirm: v })}
        />

        <ActionButton
          onClick={updatePassword}
          text={loading ? "Updating..." : "Update Password"}
        />
      </div>
    </div>
  );
}

/* ---------- REUSABLE COMPONENTS ---------- */

function TextInput({
  label,
  value,
  onChange,
  type = "text",
  disabled = false,
  placeholder = "",
}: {
  label: string;
  value: string;
  onChange?: (v: string) => void;
  type?: string;
  disabled?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="text-sm text-gray-300">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        className={`bg-[#0C111C] border border-white/10 text-sm px-4 py-2 rounded-lg outline-none w-full mt-1 ${
          disabled ? "opacity-70" : ""
        }`}
      />
    </div>
  );
}

function TextArea({
  label,
  value,
  onChange,
  placeholder = "",
}: {
  label: string;
  value: string;
  onChange?: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="text-sm text-gray-300">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="bg-[#0C111C] border border-white/10 text-sm px-4 py-2 rounded-lg outline-none w-full mt-1 min-h-[100px]"
        placeholder={placeholder}
      />
    </div>
  );
}

function ToggleRow({
  title,
  enabled,
  onChange,
}: {
  title: string;
  enabled: boolean;
  onChange: () => void;
}) {
  return (
    <div className="flex justify-between items-center border-b border-white/10 pb-3">
      <p className="capitalize">{title}</p>
      <button
        onClick={onChange}
        className={`w-12 h-6 flex items-center rounded-full transition ${
          enabled ? "bg-blue-600" : "bg-gray-600"
        }`}
      >
        <div
          className={`bg-white w-5 h-5 rounded-full transform transition ${
            enabled ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}

function ActionButton({
  onClick,
  text,
}: {
  onClick: () => void;
  text: string;
}) {
  return (
    <button
      onClick={onClick}
      className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-2 rounded-lg font-medium hover:scale-[1.03] transition w-fit"
    >
      {text}
    </button>
  );
}
