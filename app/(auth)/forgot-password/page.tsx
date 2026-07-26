"use client";

import { useState } from "react";
import Link from "next/link";
import { forgotPasswordAction } from "../actions";
import { Briefcase } from "lucide-react";

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
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-12">
      <div className="w-full max-w-md space-y-8 bg-background p-8 rounded-xl border shadow-sm">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 font-bold text-2xl text-primary">
            <Briefcase className="h-7 w-7" />
            <span>Hackerzone</span>
          </Link>
          <h2 className="text-2xl font-bold tracking-tight">Reset Password</h2>
          <p className="text-sm text-muted-foreground">
            Enter your email to receive a password reset link
          </p>
        </div>

        {statusMessage && (
          <div
            className={`p-3 text-sm rounded-md text-center ${
              statusMessage.type === "error"
                ? "text-destructive bg-destructive/10 border border-destructive/20"
                : "text-emerald-700 bg-emerald-50 border border-emerald-200"
            }`}
          >
            {statusMessage.text}
          </div>
        )}

        <form action={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email Address</label>
            <input
              type="email"
              name="email"
              required
              placeholder="you@example.com"
              className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-10 rounded-md bg-primary text-primary-foreground font-medium text-sm transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            {isSubmitting ? "Sending Link..." : "Send Reset Link"}
          </button>
        </form>

        <div className="text-center text-sm text-muted-foreground">
          Remember your password?{" "}
          <Link href="/sign-in" className="text-primary font-medium hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
