"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { signOutAction } from "@/app/(auth)/actions";
import { NotificationBell } from "./notification-bell";
import {
  ChevronDown,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { UserRole } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [role, setRole] = useState<UserRole | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    async function loadUser() {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          setUserId(user.id);
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

    const handleScroll = () => {
      if (window.scrollY > 30) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-[#0A0A0A]/90 backdrop-blur-md border-b border-[#3F3F3F] shadow-2xl py-3 text-white"
          : "bg-[#0A0A0A] border-b border-[#3F3F3F]/50 py-4 text-white"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group focus:outline-none shrink-0"
        >
          <Image
            src="/hackerzone-logo.svg"
            alt="Hackerzone"
            width={160}
            height={36}
            className="h-8 w-auto"
            priority
          />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
          {!role && (
            <>
              <Link
                href="/for-employers"
                className="px-4 py-2 text-[#A3A3A3] hover:text-white transition-colors duration-150"
              >
                Employers
              </Link>
              <Link
                href="/for-students"
                className="px-4 py-2 text-[#A3A3A3] hover:text-white transition-colors duration-150"
              >
                Job seekers
              </Link>
              <Link
                href="/for-institutions"
                className="px-4 py-2 text-[#A3A3A3] hover:text-white transition-colors duration-150"
              >
                Career centers
              </Link>
              <Link
                href="/arena"
                className="px-4 py-2 text-[#A3A3A3] hover:text-white transition-colors duration-150"
              >
                Skill Arena
              </Link>
              <Link
                href="/jobs"
                className="px-4 py-2 text-[#A3A3A3] hover:text-white transition-colors duration-150"
              >
                Resources
              </Link>
            </>
          )}

          {role === "student" && (
            <>
              <Link href="/student/dashboard" className="px-4 py-2 text-[#A3A3A3] hover:text-white transition-colors duration-150">
                Dashboard
              </Link>
              <Link href="/jobs" className="px-4 py-2 text-[#A3A3A3] hover:text-white transition-colors duration-150">
                Browse Jobs
              </Link>
              <Link href="/student/applications" className="px-4 py-2 text-[#A3A3A3] hover:text-white transition-colors duration-150">
                Applications
              </Link>
              <Link href="/messages" className="px-4 py-2 text-[#A3A3A3] hover:text-white transition-colors duration-150">
                Messages
              </Link>
            </>
          )}

          {role === "employer" && (
            <>
              <Link href="/employer/dashboard" className="px-4 py-2 text-[#A3A3A3] hover:text-white transition-colors duration-150">
                Dashboard
              </Link>
              <Link href="/employer/jobs/new" className="px-4 py-2 text-[#A3A3A3] hover:text-white transition-colors duration-150">
                Post Job
              </Link>
              <Link href="/employer/jobs" className="px-4 py-2 text-[#A3A3A3] hover:text-white transition-colors duration-150">
                Jobs List
              </Link>
              <Link href="/messages" className="px-4 py-2 text-[#A3A3A3] hover:text-white transition-colors duration-150">
                Messages
              </Link>
            </>
          )}

          {role === "institution_admin" && (
            <>
              <Link href="/institution/dashboard" className="px-4 py-2 text-[#A3A3A3] hover:text-white transition-colors duration-150">
                Dashboard
              </Link>
              <Link href="/institution/students" className="px-4 py-2 text-[#A3A3A3] hover:text-white transition-colors duration-150">
                Students
              </Link>
              <Link href="/institution/events" className="px-4 py-2 text-[#A3A3A3] hover:text-white transition-colors duration-150">
                Events
              </Link>
            </>
          )}

          {role === "admin" && (
            <Link href="/admin/dashboard" className="px-4 py-2 text-[#A3A3A3] hover:text-white transition-colors duration-150">
              Admin Panel
            </Link>
          )}
        </nav>

        {/* Auth CTAs */}
        <div className="hidden md:flex items-center gap-3">
          {userId ? (
            <div className="flex items-center gap-3">
              <NotificationBell userId={userId} />
              <span className="text-xs px-3 py-1 rounded-full bg-white/10 text-white font-medium capitalize border border-white/20">
                {role?.replace("_", " ")}
              </span>
              <form action={signOutAction}>
                <Button type="submit" variant="dark" size="sm" className="gap-1.5">
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Sign Out</span>
                </Button>
              </form>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/sign-in">
                <button className="px-5 py-2 text-sm font-medium text-white border border-white/30 rounded-full hover:bg-white/10 transition-colors duration-150">
                  Log in
                </button>
              </Link>
              <Link href="/sign-up">
                <button className="px-5 py-2 text-sm font-medium text-[#0A0A0A] bg-white rounded-full hover:bg-gray-100 transition-colors duration-150">
                  Sign up
                </button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex md:hidden items-center gap-2">
          {userId && <NotificationBell userId={userId} />}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-white hover:bg-white/10 focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#0A0A0A] border-b border-[#3F3F3F] px-4 pt-3 pb-6 space-y-3"
          >
            <div className="flex flex-col gap-2 text-sm font-medium">
              {!role && (
                <>
                  <Link href="/for-employers" onClick={() => setMobileMenuOpen(false)} className="p-2.5 hover:bg-white/5 rounded-xl text-slate-200">
                    Employers
                  </Link>
                  <Link href="/for-students" onClick={() => setMobileMenuOpen(false)} className="p-2.5 hover:bg-white/5 rounded-xl text-slate-200">
                    Job seekers
                  </Link>
                  <Link href="/for-institutions" onClick={() => setMobileMenuOpen(false)} className="p-2.5 hover:bg-white/5 rounded-xl text-slate-200">
                    Career centers
                  </Link>
                  <Link href="/arena" onClick={() => setMobileMenuOpen(false)} className="p-2.5 hover:bg-white/5 rounded-xl text-[#A3A3A3] hover:text-white">
                    Skill Arena
                  </Link>
                  <Link href="/jobs" onClick={() => setMobileMenuOpen(false)} className="p-2.5 hover:bg-white/5 rounded-xl text-[#A3A3A3] hover:text-white">
                    Resources
                  </Link>
                </>
              )}

              {role === "student" && (
                <>
                  <Link href="/student/dashboard" onClick={() => setMobileMenuOpen(false)} className="p-2.5 hover:bg-white/5 rounded-xl text-slate-200">Dashboard</Link>
                  <Link href="/jobs" onClick={() => setMobileMenuOpen(false)} className="p-2.5 hover:bg-white/5 rounded-xl text-slate-200">Browse Jobs</Link>
                  <Link href="/student/applications" onClick={() => setMobileMenuOpen(false)} className="p-2.5 hover:bg-white/5 rounded-xl text-slate-200">Applications</Link>
                  <Link href="/messages" onClick={() => setMobileMenuOpen(false)} className="p-2.5 hover:bg-white/5 rounded-xl text-slate-200">Messages</Link>
                </>
              )}

              {role === "employer" && (
                <>
                  <Link href="/employer/dashboard" onClick={() => setMobileMenuOpen(false)} className="p-2.5 hover:bg-white/5 rounded-xl text-slate-200">Dashboard</Link>
                  <Link href="/employer/jobs/new" onClick={() => setMobileMenuOpen(false)} className="p-2.5 hover:bg-white/5 rounded-xl text-slate-200">Post Job</Link>
                  <Link href="/employer/jobs" onClick={() => setMobileMenuOpen(false)} className="p-2.5 hover:bg-white/5 rounded-xl text-slate-200">Jobs List</Link>
                  <Link href="/messages" onClick={() => setMobileMenuOpen(false)} className="p-2.5 hover:bg-white/5 rounded-xl text-slate-200">Messages</Link>
                </>
              )}

              {role === "institution_admin" && (
                <>
                  <Link href="/institution/dashboard" onClick={() => setMobileMenuOpen(false)} className="p-2.5 hover:bg-white/5 rounded-xl text-slate-200">Dashboard</Link>
                  <Link href="/institution/students" onClick={() => setMobileMenuOpen(false)} className="p-2.5 hover:bg-white/5 rounded-xl text-slate-200">Students</Link>
                  <Link href="/institution/events" onClick={() => setMobileMenuOpen(false)} className="p-2.5 hover:bg-white/5 rounded-xl text-slate-200">Events</Link>
                </>
              )}
            </div>

            <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
              {userId ? (
                <form action={signOutAction}>
                  <Button type="submit" variant="dark" className="w-full justify-center">
                    Sign Out
                  </Button>
                </form>
              ) : (
                <>
                  <Link href="/sign-in" onClick={() => setMobileMenuOpen(false)}>
                    <button className="w-full px-5 py-2.5 text-sm font-medium text-white border border-white/30 rounded-full hover:bg-white/10 transition-colors">
                      Log in
                    </button>
                  </Link>
                  <Link href="/sign-up" onClick={() => setMobileMenuOpen(false)}>
                    <button className="w-full px-5 py-2.5 text-sm font-medium text-[#0A0A0A] bg-white rounded-full hover:bg-gray-100 transition-colors">
                      Sign up
                    </button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
