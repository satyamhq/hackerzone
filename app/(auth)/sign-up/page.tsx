"use client";

import { useState } from "react";
import Link from "next/link";
import { signUpAction } from "../actions";
import { Briefcase, Building2, GraduationCap, UserCheck } from "lucide-react";

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
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-12">
      <div className="w-full max-w-md space-y-8 bg-background p-8 rounded-xl border shadow-sm">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 font-bold text-2xl text-primary">
            <Briefcase className="h-7 w-7" />
            <span>Hackerzone</span>
          </Link>
          <h2 className="text-2xl font-bold tracking-tight">Create your account</h2>
          <p className="text-sm text-muted-foreground">Select your role to get started</p>
        </div>

        {errorMessage && (
          <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md text-center">
            {errorMessage}
          </div>
        )}

        {/* Role Selection Tabs */}
        <div className="grid grid-cols-3 gap-2 p-1 bg-muted rounded-lg text-center text-xs font-medium">
          <button
            type="button"
            onClick={() => setRole("student")}
            className={`flex flex-col items-center gap-1 p-2 rounded-md transition-colors ${
              role === "student" ? "bg-background text-primary shadow-sm font-semibold" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <UserCheck className="h-4 w-4" />
            <span>Student</span>
          </button>
          <button
            type="button"
            onClick={() => setRole("employer")}
            className={`flex flex-col items-center gap-1 p-2 rounded-md transition-colors ${
              role === "employer" ? "bg-background text-primary shadow-sm font-semibold" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Building2 className="h-4 w-4" />
            <span>Employer</span>
          </button>
          <button
            type="button"
            onClick={() => setRole("institution_admin")}
            className={`flex flex-col items-center gap-1 p-2 rounded-md transition-colors ${
              role === "institution_admin" ? "bg-background text-primary shadow-sm font-semibold" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <GraduationCap className="h-4 w-4" />
            <span>Institution</span>
          </button>
        </div>

        <form action={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              name="fullName"
              required
              placeholder="e.g. Rahul Sharma"
              className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>

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

          {role === "student" && (
            <div>
              <label className="block text-sm font-medium mb-1">
                Institution Email <span className="text-xs font-normal text-muted-foreground">(Optional for auto-affiliation)</span>
              </label>
              <input
                type="email"
                name="institutionEmail"
                placeholder="student@iitb.ac.in"
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              required
              minLength={6}
              placeholder="••••••••"
              className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-10 rounded-md bg-primary text-primary-foreground font-medium text-sm transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            {isSubmitting ? "Creating Account..." : `Sign Up as ${role.replace("_", " ")}`}
          </button>
        </form>

        <div className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-primary font-medium hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
