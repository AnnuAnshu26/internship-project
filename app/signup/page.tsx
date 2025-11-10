"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Zap, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export default function SignUp() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const API_BASE =
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:5000";

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      toast.error("Please fill all fields");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Signup failed");

      // ✅ Store user session
      localStorage.setItem("token", data.token);
      localStorage.setItem("userName", data.user.name);
      localStorage.setItem("user", JSON.stringify(data.user));

      toast.success(`Welcome to Teamify.AI, ${data.user.name}! 🎉`);

      // Redirect after slight delay for smoother UX
      setTimeout(() => router.push("/team/choose"), 600);
    } catch (err: any) {
      toast.error(err.message || "Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-[#0a0f1a] via-[#0b1120] to-[#060a12] text-white px-4">
      {/* 🔹 Animated Background Blobs */}
      <div className="absolute top-1/4 left-1/3 w-[28rem] h-[28rem] bg-[#4b1fff]/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/3 right-1/4 w-[25rem] h-[25rem] bg-[#b24dff]/20 rounded-full blur-[120px] animate-pulse delay-300" />

      {/* 🔹 Back to Home */}
      <Link
        href="/"
        className="absolute top-8 left-8 flex items-center gap-2 text-gray-400 hover:text-white transition-all"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Home
      </Link>

      {/* 🔹 Sign-Up Card */}
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-8 shadow-2xl hover:shadow-purple-500/10 transition-all">
        {/* App Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-12 h-12 bg-gradient-to-r from-[#5b47ff] to-[#9b59ff] rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Zap className="w-7 h-7 text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-[#5b47ff] to-[#9b59ff] bg-clip-text text-transparent">
            Teamify.AI
          </span>
        </div>

        {/* Tabs */}
        <div className="flex mb-6 rounded-xl bg-black/40 border border-white/10 overflow-hidden">
          <button
            onClick={() => router.push("/signin")}
            className="w-1/2 py-2 text-gray-400 hover:text-white transition"
          >
            Login
          </button>
          <button className="w-1/2 py-2 bg-black/80 text-white font-medium cursor-default">
            Sign Up
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSignup} className="space-y-5">
          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-300">
              Full Name
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="bg-black/40 border border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-[#8b5cff]"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-300">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="bg-black/40 border border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-[#8b5cff]"
            />
          </div>

          {/* Password */}
          <div className="space-y-2 relative">
            <Label htmlFor="password" className="text-gray-300">
              Password
            </Label>
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="bg-black/40 border border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-[#8b5cff] pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-[38px] text-gray-400 hover:text-white transition"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-[#5b47ff] to-[#9b59ff] font-semibold shadow-lg shadow-indigo-500/40 hover:opacity-90 transition-all"
          >
            {isLoading ? "Creating account..." : "Create Account"}
          </Button>

          {/* Redirect */}
          <p className="text-center text-sm text-gray-400 mt-4">
            Already have an account?{" "}
            <Link
              href="/signin"
              className="text-[#9b59ff] hover:underline font-medium"
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
