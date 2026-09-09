"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { UserRole } from "@/types/database.types";
import { GraduationCap, Building2, Landmark, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<UserRole>("student");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const supabase = createClient();

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);

      const redirectUrl = `${window.location.origin}/api/auth/callback?role=${selectedRole}`;

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (error) {
        setErrorMessage(error.message);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || "An unexpected error occurred during login.");
    } finally {
      setIsLoading(false);
    }
  };

  const roleDetails = {
    student: {
      title: "Student & AI Specialist",
      desc: "Earn verified skill scores, get discovered by AI companies, and apply to top roles.",
      icon: GraduationCap,
    },
    recruiter: {
      title: "Employer & Recruiter",
      desc: "Hire pre-evaluated talent with verified benchmark scores. Post jobs free.",
      icon: Building2,
    },
    campus_admin: {
      title: "Campus Career Center",
      desc: "Track student placement outcomes, manage employer access, and host hackathons.",
      icon: Landmark,
    },
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Radial charcoal gradient background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#262626] via-[#141414] to-[#0A0A0A] opacity-80 pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo / Brand Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-4 hover:opacity-80 transition-opacity">
            <Image
              src="/logo/hackerzone-logo.png"
              alt="Hackerzone"
              width={200}
              height={50}
              className="h-10 w-auto mx-auto object-contain"
              priority
            />
          </Link>
          <h1 className="text-2xl md:text-3xl font-black italic uppercase tracking-tight text-white mt-1">
            Sign In to Hackerzone
          </h1>
          <p className="text-sm text-[#A3A3A3] mt-1">
            The human intelligence network powering the AI economy.
          </p>
        </div>

        {/* Card Container */}
        <div className="bg-[#141414] border border-[#3F3F3F] rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
          {/* Role Intent Selector */}
          <div className="mb-6">
            <label className="block text-xs font-semibold text-[#A3A3A3] uppercase tracking-wider mb-2">
              Select Your Profile Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["student", "recruiter", "campus_admin"] as UserRole[]).map((role) => {
                const isSelected = selectedRole === role;
                const Icon = roleDetails[role as keyof typeof roleDetails].icon;
                const label = role === "student" ? "Student" : role === "recruiter" ? "Employer" : "Campus";

                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setSelectedRole(role)}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-medium transition-all ${
                      isSelected
                        ? "bg-white text-black border-white shadow-md font-semibold"
                        : "bg-[#1C1C1C] text-[#A3A3A3] border-[#3F3F3F] hover:border-[#666666] hover:text-white"
                    }`}
                  >
                    <Icon className={`w-4 h-4 mb-1.5 ${isSelected ? "text-black" : "text-[#A3A3A3]"}`} />
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-3 p-3 bg-[#1C1C1C] border border-[#2D2D2D] rounded-xl flex items-start space-x-2.5">
              <Sparkles className="w-4 h-4 text-white shrink-0 mt-0.5" />
              <p className="text-xs text-[#A3A3A3] leading-relaxed">
                {roleDetails[selectedRole as keyof typeof roleDetails]?.desc}
              </p>
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-950/40 border border-red-800/60 rounded-xl text-xs text-red-300">
              {errorMessage}
            </div>
          )}

          {/* Google OAuth Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full h-12 rounded-full bg-white hover:bg-[#F0F0F0] text-black font-semibold text-sm flex items-center justify-center space-x-3 transition-all transform active:scale-[0.99] shadow-lg disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15.1s.7 5.4 1.9 7.8l3.7-2.9z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2-6.4-4.8L1.9 16.9C3.7 20.6 7.5 23.5 12 23.5z"
                  />
                </svg>
                <span>Continue with Google</span>
                <ArrowRight className="w-4 h-4 text-black ml-1" />
              </>
            )}
          </button>

          {/* Privacy & Security Note */}
          <div className="mt-6 pt-5 border-t border-[#2A2A2A] flex items-center justify-center space-x-2 text-[#737373] text-xs">
            <ShieldCheck className="w-4 h-4 text-[#A3A3A3]" />
            <span>Secure 2-Factor Google OAuth · No password required</span>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-6 text-center text-xs text-[#737373]">
          By continuing, you agree to Hackerzone&apos;s{" "}
          <Link href="/legal/terms" className="text-[#A3A3A3] hover:text-white underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/legal/privacy" className="text-[#A3A3A3] hover:text-white underline">
            Privacy Policy
          </Link>
          .
        </div>
      </div>
    </div>
  );
}
