"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { signInAction } from "../actions";
import { Briefcase, ArrowRight, Sparkles, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function SignInForm() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo");

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    setErrorMessage(null);
    if (redirectTo) {
      formData.append("redirectTo", redirectTo);
    }

    const res = await signInAction(formData);
    if (res?.error) {
      setErrorMessage(res.error);
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="w-full max-w-md p-8 md:p-10 space-y-8 shadow-2xl bg-white border border-slate-100/80 rounded-3xl">
      <div className="text-center space-y-3">
        <Link href="/" className="inline-flex items-center justify-center p-3 rounded-2xl bg-[#0A0A0A] hover:bg-[#1C1C1C] transition-colors shadow-md">
          <Image
            src="/logo/hackerzone-logo.png"
            alt="Hackerzone"
            width={160}
            height={40}
            className="h-7 w-auto object-contain"
            priority
          />
        </Link>
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Welcome Back</h2>
        <p className="text-xs text-slate-500 font-medium">Sign in to your career dashboard</p>
      </div>

      {errorMessage && (
        <div className="p-3.5 text-xs text-rose-800 bg-rose-50 border border-rose-200 rounded-2xl text-center font-semibold animate-in fade-in-50">
          {errorMessage}
        </div>
      )}

      <form action={handleSubmit} className="space-y-5">
        <Input
          label="Email Address"
          type="email"
          name="email"
          required
          placeholder="you@domain.com"
        />

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold text-slate-700 tracking-wide">
              Password
            </label>
            <Link href="/forgot-password" className="text-xs font-bold text-blue-600 hover:underline">
              Forgot password?
            </Link>
          </div>
          <input
            type="password"
            name="password"
            required
            placeholder="••••••••"
            className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 shadow-sm transition-all duration-200 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
          />
        </div>

        <Button
          type="submit"
          isLoading={isSubmitting}
          variant="brand"
          className="w-full justify-center shadow-lg shadow-blue-500/20 font-bold"
        >
          Sign In to Account
        </Button>
      </form>

      <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
        Don't have an account yet?{" "}
        <Link href="/sign-up" className="text-blue-600 font-extrabold hover:underline">
          Create Account Free
        </Link>
      </div>
    </Card>
  );
}

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAFBFC] bg-radial-glow px-4 py-12">
      <Suspense fallback={<div className="text-center text-xs text-slate-400">Loading sign in form...</div>}>
        <SignInForm />
      </Suspense>
    </div>
  );
}
