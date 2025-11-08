"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Zap } from "lucide-react";
import { toast } from "sonner";

export default function SignIn() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      // ✅ Save token & user data
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("userName", data.user.name);

      toast.success("Welcome back " + data.user.name + " 🚀");

      // ✅ Redirect to dashboard or team page
      router.push("/dashboard");

    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-[#090d17] via-[#0b1120] to-[#050910] text-white px-4">
      {/* Decorative gradient orbs */}
      <div className="absolute top-1/4 left-1/3 w-[26rem] h-[26rem] bg-[#5b47ff]/25 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/3 right-1/4 w-[24rem] h-[24rem] bg-[#b24dff]/25 rounded-full blur-[120px]" />

      {/* Back to Home */}
      <Link
        href="/"
        className="absolute top-8 left-8 flex items-center gap-2 text-gray-400 hover:text-white transition-all"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to Home</span>
      </Link>

      {/* Sign In Card */}
      <div className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-r from-[#5b47ff] to-[#9b59ff] shadow-lg shadow-indigo-500/40">
            <Zap className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-[#5b47ff] to-[#9b59ff] bg-clip-text text-transparent">
            Teamify.AI
          </h1>
        </div>

        {/* Tabs */}
        <div className="flex mb-6 rounded-xl bg-black/40 border border-white/10 overflow-hidden">
          <button className="w-1/2 py-2 bg-black/70 text-white font-semibold cursor-default">
            Login
          </button>
          <button
            type="button"
            onClick={() => router.push("/signup")}
            className="w-1/2 py-2 text-gray-400 hover:text-white transition"
          >
            Sign Up
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-300">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="bg-black/40 border border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-[#8b5cff]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-300">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="bg-black/40 border border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-[#8b5cff]"
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-[#5b47ff] to-[#9b59ff] font-semibold shadow-lg shadow-indigo-500/40 hover:opacity-90 transition-all"
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </Button>

          <p className="text-center text-sm text-gray-400 mt-4">
            Don’t have an account?{" "}
            <Link
              href="/signup"
              className="text-[#9b59ff] hover:underline font-medium"
            >
              Create one
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
