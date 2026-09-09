"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { forgotPasswordAction } from "../actions";
import { Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export default function ForgotPasswordPage() {
  const [statusMessage, setStatusMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    setStatusMessage(null);

    const res = await forgotPasswordAction(formData);
    if (res?.error) {
      setStatusMessage({ type: "error", text: res.error });
    } else if (res?.success) {
      setStatusMessage({ type: "success", text: res.success });
    }
    setIsSubmitting(false);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAFBFC] bg-radial-glow px-4 py-12">
      <Card className="w-full max-w-md p-8 md:p-10 space-y-8 shadow-2xl bg-white border border-slate-100/80 rounded-3xl">
        <div className="text-center space-y-3">
          <Link href="/" className="inline-flex items-center justify-center p-3 rounded-2xl bg-[#0A0A0A] hover:bg-[#1C1C1C] transition-colors shadow-md">
            <Image
              src="/hackerzone_logo.png"
              alt="Hackerzone"
              width={160}
              height={40}
              className="h-7 w-auto object-contain"
              priority
            />
          </Link>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Reset Password</h2>
          <p className="text-xs text-slate-500 font-medium">
            Enter your email to receive a password reset link
          </p>
        </div>

        {statusMessage && (
          <div
            className={`p-3.5 text-xs rounded-2xl text-center font-semibold animate-in fade-in-50 ${
              statusMessage.type === "error"
                ? "text-rose-800 bg-rose-50 border border-rose-200"
                : "text-emerald-800 bg-emerald-50 border border-emerald-200"
            }`}
          >
            {statusMessage.text}
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

          <Button
            type="submit"
            isLoading={isSubmitting}
            variant="brand"
            className="w-full justify-center shadow-lg shadow-blue-500/20 font-bold"
          >
            Send Reset Link
          </Button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          Remember your password?{" "}
          <Link href="/sign-in" className="text-blue-600 font-extrabold hover:underline">
            Sign In
          </Link>
        </div>
      </Card>
    </div>
  );
}
