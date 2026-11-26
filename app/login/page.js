"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Logged in!");
        router.push(`/generate?handle=${encodeURIComponent(data.user.username)}`);
        router.refresh();
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white">
      {/* Left: Form */}
      <div className="flex flex-col justify-between p-6 sm:p-12 lg:p-16">
        <Link href="/" className="w-fit text-2xl font-extrabold tracking-tight text-[#1E2330]">
          Cliq<span className="text-[#254F1A] bg-[#D2E823] px-1.5 py-0.5 rounded-lg ml-0.5">Me</span>
        </Link>

        <div className="w-full max-w-md mx-auto my-12">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#1E2330] tracking-tight">
            Welcome back
          </h1>
          <p className="text-gray-500 mt-2 text-sm sm:text-base">
            Log in to your CliqMe account
          </p>

          <form onSubmit={handleLogin} className="mt-8 flex flex-col gap-4">
            <input
              type="text"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Email or username"
              className="w-full bg-[#F3F3F1] px-4 py-3.5 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-[#1E2330]"
            />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full bg-[#F3F3F1] px-4 py-3.5 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-[#1E2330]"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1E2330] hover:bg-[#32394A] disabled:bg-gray-300 text-white font-bold py-4 rounded-full transition mt-2 cursor-pointer"
            >
              {loading ? "Logging in..." : "Log in"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="h-px bg-gray-200 flex-1" />
            <span className="text-xs font-semibold text-gray-400">OR</span>
            <div className="h-px bg-gray-200 flex-1" />
          </div>

          {/* Google Button */}
          <button
            type="button"
            onClick={() => signIn("google", { callbackUrl: "/generate" })}
            className="w-full border border-gray-300 hover:bg-[#F3F3F1] text-[#1E2330] font-bold py-3.5 rounded-full flex items-center justify-center gap-3 transition cursor-pointer"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.7-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.8z" />
              <path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-2.9l-3.9-3c-1.1.7-2.5 1.2-4.1 1.2-3.2 0-5.8-2.1-6.8-5H1.2v3.1C3.2 21.3 7.3 24 12 24z" />
              <path fill="#FBBC05" d="M5.2 14.3c-.2-.7-.4-1.5-.4-2.3s.1-1.6.4-2.3V6.6H1.2C.4 8.2 0 10.1 0 12s.4 3.8 1.2 5.4l4-3.1z" />
              <path fill="#EA4335" d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4C17.9 1.2 15.2 0 12 0 7.3 0 3.2 2.7 1.2 6.6l4 3.1c1-2.9 3.6-4.9 6.8-4.9z" />
            </svg>
            Continue with Google
          </button>

          <p className="text-center text-sm text-gray-600 mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-[#2665D6] font-bold hover:underline">
              Sign up
            </Link>
          </p>
        </div>

        <p className="text-xs text-gray-400 text-center lg:text-left">
          © {new Date().getFullYear()} CliqMe
        </p>
      </div>

      {/* Right: Blue Visual Panel */}
      <div className="hidden lg:flex bg-[#2665D6] items-center justify-center p-12 relative overflow-hidden">
        <div className="w-full max-w-sm bg-white/10 backdrop-blur-md border border-white/20 rounded-[2.5rem] p-8 text-white shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-[#D2E823] text-[#254F1A] flex items-center justify-center font-extrabold text-xl">
              C
            </div>
            <div>
              <p className="font-extrabold text-lg">@yourhandle</p>
              <p className="text-xs text-white/75">All your links in one place</p>
            </div>
          </div>
          <div className="space-y-3">
            {["Portfolio", "GitHub", "YouTube Channel", "Contact Me"].map((item) => (
              <div
                key={item}
                className="bg-white text-[#1E2330] font-bold text-sm py-3.5 px-5 rounded-full text-center shadow-sm"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      <ToastContainer position="bottom-right" />
    </div>
  );
}