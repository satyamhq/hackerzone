"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { signOutAction } from "@/app/(auth)/actions";
import { NotificationBell } from "./notification-bell";
import { Briefcase, LogOut, MessageSquare, User } from "lucide-react";
import { UserRole } from "@/types";

export function Navbar() {
  const [role, setRole] = useState<UserRole | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          setUserId(user.id);
          setUserEmail(user.email ?? null);
          const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single();

          setRole(profile?.role || "student");
        }
      } catch (e) {
        // Unauthenticated
      }
    }
    loadUser();
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
          <Briefcase className="h-6 w-6" />
          <span>Hackerzone</span>
        </Link>

        {/* Dynamic Navigation Links Based on User Role */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {!role && (
            <>
              <Link href="/jobs" className="text-muted-foreground transition-colors hover:text-foreground">
                Jobs
              </Link>
              <Link href="/employers" className="text-muted-foreground transition-colors hover:text-foreground">
                Employers
              </Link>
              <Link href="/institutions" className="text-muted-foreground transition-colors hover:text-foreground">
                Institutions
              </Link>
            </>
          )}

          {role === "student" && (
            <>
              <Link href="/student/dashboard" className="text-muted-foreground transition-colors hover:text-foreground">
                Dashboard
              </Link>
              <Link href="/jobs" className="text-muted-foreground transition-colors hover:text-foreground">
                Browse Jobs
              </Link>
              <Link href="/student/applications" className="text-muted-foreground transition-colors hover:text-foreground">
                Applications
              </Link>
              <Link href="/messages" className="text-muted-foreground transition-colors hover:text-foreground">
                Messages
              </Link>
            </>
          )}

          {role === "employer" && (
            <>
              <Link href="/employer/dashboard" className="text-muted-foreground transition-colors hover:text-foreground">
                Dashboard
              </Link>
              <Link href="/employer/jobs/new" className="text-muted-foreground transition-colors hover:text-foreground">
                Post Job
              </Link>
              <Link href="/employer/jobs" className="text-muted-foreground transition-colors hover:text-foreground">
                Jobs List
              </Link>
              <Link href="/messages" className="text-muted-foreground transition-colors hover:text-foreground">
                Messages
              </Link>
            </>
          )}

          {role === "institution_admin" && (
            <>
              <Link href="/institution/dashboard" className="text-muted-foreground transition-colors hover:text-foreground">
                Dashboard
              </Link>
              <Link href="/institution/students" className="text-muted-foreground transition-colors hover:text-foreground">
                Students
              </Link>
              <Link href="/institution/events" className="text-muted-foreground transition-colors hover:text-foreground">
                Events
              </Link>
            </>
          )}

          {role === "admin" && (
            <>
              <Link href="/admin/dashboard" className="text-muted-foreground transition-colors hover:text-foreground">
                Admin Panel
              </Link>
            </>
          )}
        </nav>

        {/* Dynamic Auth Action Buttons & Notification Bell */}
        <div className="flex items-center gap-3">
          {userId ? (
            <div className="flex items-center gap-3">
              <NotificationBell userId={userId} />

              <span className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-semibold capitalize">
                {role?.replace("_", " ")}
              </span>

              <form action={signOutAction}>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded-md text-xs font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 px-3"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Sign Out</span>
                </button>
              </form>
            </div>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
