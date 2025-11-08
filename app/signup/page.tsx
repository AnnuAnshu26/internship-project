"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Zap } from "lucide-react";
import { toast } from "sonner";

export default function SignUp() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);


    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      console.log("Response status:", res.status);
      console.log("Response data:", data);
      console.log("Token saved ✅", data.token);


      if (!res.ok) {
        toast.error(data.message || "Signup failed");
        setIsLoading(false);
        return;
      }

      // ✅ Save token and redirect
      localStorage.setItem("token", data.token);
      localStorage.setItem("userName", data.user.name);
      toast.success("Account created! Welcome aboard 🚀");
      router.push("/team/choose");

    } catch (error) {
      toast.error("Something went wrong!");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-[#0a0f1a] via-[#0b1120] to-[#060a12] text-white px-4">
      {/* Soft gradient orbs */}
      <div className="absolute top-1/4 left-1/3 w-[28rem] h-[28rem] bg-[#4b1fff]/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/3 right-1/4 w-[25rem] h-[25rem] bg-[#b24dff]/20 rounded-full blur-[120px]" />

      {/* Back to Home */}
      <Link
        href="/"
        className="absolute top-8 left-8 flex items-center gap-2 text-gray-400 hover:text-white transition-all"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Home
      </Link>

      {/* Signup Card */}
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-8 shadow-2xl">
        {/* Logo */}
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
            className="w-1/2 py-2 text-gray-400 hover:text-white transition"
            onClick={() => router.push("/signin")}
          >
            Login
          </button>
          <button className="w-1/2 py-2 bg-black/80 text-white font-medium">
            Sign Up
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSignup} className="space-y-5">
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

          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-300">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="bg-black/40 border border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-[#8b5cff]"
            />

          </div>

          {/* <div className="space-y-2">
            <Label htmlFor="team-code" className="text-gray-300">
              Team Code (Optional)
            </Label>
            <Input
              id="team-code"
              type="text"
              placeholder="HACK2024"
              className="bg-black/40 border border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-[#8b5cff]"
            />
          </div> */}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full mt-4 bg-gradient-to-r from-[#5b47ff] to-[#9b59ff] hover:opacity-90 transition-all font-semibold py-3 rounded-xl shadow-lg shadow-indigo-500/30"
          >
            {isLoading ? "Creating account..." : "Create Account"}
          </Button>

          <p className="text-center text-sm text-gray-400 mt-4">
            Already have an account?{" "}
            <Link href="/signin" className="text-[#9b59ff] hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
