"use client";

import { useState } from "react";
import Link from "next/link";
import { signUpAction } from "../actions";
import { Briefcase, Building2, GraduationCap, UserCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function SignUpPage() {
  const [role, setRole] = useState<"student" | "employer" | "institution_admin">("student");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    setErrorMessage(null);
    formData.append("role", role);

    const res = await signUpAction(formData);
    if (res?.error) {
      setErrorMessage(res.error);
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAFBFC] bg-radial-glow px-4 py-12">
      <Card className="w-full max-w-md p-8 md:p-10 space-y-8 shadow-2xl bg-white border border-slate-100/80 rounded-3xl">
        <div className="text-center space-y-3">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md">
              <Briefcase className="h-5 w-5 stroke-[2.5]" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-slate-900">
              Hackerzone
            </span>
          </Link>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Create Your Account</h2>
          <p className="text-xs text-slate-500 font-medium">Select your platform role to get started</p>
        </div>

        {errorMessage && (
          <div className="p-3.5 text-xs text-rose-800 bg-rose-50 border border-rose-200 rounded-2xl text-center font-semibold animate-in fade-in-50">
            {errorMessage}
          </div>
        )}

        {/* Role Selection Tabs */}
        <div className="grid grid-cols-3 gap-1.5 p-1.5 bg-slate-100 rounded-2xl text-center text-xs font-bold">
          <button
            type="button"
            onClick={() => setRole("student")}
            className={`flex flex-col items-center gap-1 p-2.5 rounded-xl transition-all duration-150 ${
              role === "student"
                ? "bg-white text-slate-900 shadow-sm border border-slate-200/60"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <UserCheck className="h-4 w-4 text-blue-600" />
            <span>Student</span>
          </button>
          <button
            type="button"
            onClick={() => setRole("employer")}
            className={`flex flex-col items-center gap-1 p-2.5 rounded-xl transition-all duration-150 ${
              role === "employer"
                ? "bg-white text-slate-900 shadow-sm border border-slate-200/60"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <Building2 className="h-4 w-4 text-indigo-600" />
            <span>Employer</span>
          </button>
          <button
            type="button"
            onClick={() => setRole("institution_admin")}
            className={`flex flex-col items-center gap-1 p-2.5 rounded-xl transition-all duration-150 ${
              role === "institution_admin"
                ? "bg-white text-slate-900 shadow-sm border border-slate-200/60"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <GraduationCap className="h-4 w-4 text-sky-600" />
            <span>Institution</span>
          </button>
        </div>

        <form action={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            type="text"
            name="fullName"
            required
            placeholder="e.g. Sanya Sharma"
          />

          <Input
            label="Email Address"
            type="email"
            name="email"
            required
            placeholder="you@domain.com"
          />

          {role === "student" && (
            <Input
              label="Institution Email (Optional)"
              type="email"
              name="institutionEmail"
              placeholder="student@iitb.ac.in"
            />
          )}

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 tracking-wide">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              minLength={6}
              placeholder="••••••••"
              className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 shadow-sm transition-all duration-200 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
            />
          </div>

          <Button
            type="submit"
            isLoading={isSubmitting}
            variant="brand"
            className="w-full justify-center shadow-lg shadow-blue-500/20 font-bold capitalize"
          >
            Create {role.replace("_", " ")} Account
          </Button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-blue-600 font-extrabold hover:underline">
            Sign In
          </Link>
        </div>
      </Card>
    </div>
  );
}
