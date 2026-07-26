"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { signInAction } from "../actions";
import { Briefcase } from "lucide-react";

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
    <div className="w-full max-w-md space-y-8 bg-background p-8 rounded-xl border shadow-sm">
      <div className="text-center space-y-2">
        <Link href="/" className="inline-flex items-center gap-2 font-bold text-2xl text-primary">
          <Briefcase className="h-7 w-7" />
          <span>Hackerzone</span>
        </Link>
        <h2 className="text-2xl font-bold tracking-tight">Welcome back</h2>
        <p className="text-sm text-muted-foreground">Sign in to your account</p>
      </div>

      {errorMessage && (
        <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md text-center">
          {errorMessage}
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

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-medium">Password</label>
            <Link href="/forgot-password" className="text-xs text-primary font-medium hover:underline">
              Forgot password?
            </Link>
          </div>
          <input
            type="password"
            name="password"
            required
            placeholder="••••••••"
            className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-10 rounded-md bg-primary text-primary-foreground font-medium text-sm transition-colors hover:bg-primary/90 disabled:opacity-50"
        >
          {isSubmitting ? "Signing In..." : "Sign In"}
        </button>
      </form>

      <div className="text-center text-sm text-muted-foreground">
        Don't have an account?{" "}
        <Link href="/sign-up" className="text-primary font-medium hover:underline">
          Sign Up
        </Link>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-12">
      <Suspense fallback={<div className="text-center text-sm text-muted-foreground">Loading sign in...</div>}>
        <SignInForm />
      </Suspense>
    </div>
  );
}
