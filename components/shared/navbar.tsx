"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { signOutAction } from "@/app/(auth)/actions";
import { NotificationBell } from "./notification-bell";
import {
  Briefcase,
  ChevronDown,
  GraduationCap,
  LogOut,
  Menu,
  Sparkles,
  UserCheck,
  Building2,
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
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);

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
      if (window.scrollY > 20) {
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
          ? "bg-white/85 backdrop-blur-md border-b border-slate-200/60 shadow-soft py-3"
          : "bg-transparent py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group focus:outline-none"
        >
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-700 text-white flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
            <Briefcase className="h-5 w-5 stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-xl tracking-tight text-slate-900 leading-none">
              Hackerzone
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
              Career Network
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100/60 p-1.5 rounded-full border border-slate-200/50 backdrop-blur-sm">
          {!role && (
            <>
              {/* Product Mega Menu Trigger */}
              <div
                className="relative"
                onMouseEnter={() => setMegaMenuOpen(true)}
                onMouseLeave={() => setMegaMenuOpen(false)}
              >
                <button className="flex items-center gap-1 px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-white rounded-full transition-all duration-150">
                  <span>Solutions</span>
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform duration-200 ${
                      megaMenuOpen ? "rotate-180 text-blue-600" : "text-slate-400"
                    }`}
                  />
                </button>

                {/* Dropdown Mega Menu */}
                <AnimatePresence>
                  {megaMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 mt-2 w-80 p-3 rounded-3xl bg-white border border-slate-100 shadow-xl shadow-blue-500/5 z-50"
                    >
                      <div className="space-y-1">
                        <Link
                          href="/for-students"
                          className="flex items-start gap-3 p-3 rounded-2xl hover:bg-slate-50 transition-colors group"
                        >
                          <div className="p-2 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            <UserCheck className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-900">
                              For Students
                            </div>
                            <div className="text-[11px] text-slate-500">
                              Verified engineering profiles & job matching
                            </div>
                          </div>
                        </Link>

                        <Link
                          href="/for-employers"
                          className="flex items-start gap-3 p-3 rounded-2xl hover:bg-slate-50 transition-colors group"
                        >
                          <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                            <Building2 className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-900">
                              For Employers
                            </div>
                            <div className="text-[11px] text-slate-500">
                              Recruit top technical campus talent
                            </div>
                          </div>
                        </Link>

                        <Link
                          href="/for-institutions"
                          className="flex items-start gap-3 p-3 rounded-2xl hover:bg-slate-50 transition-colors group"
                        >
                          <div className="p-2 rounded-xl bg-sky-50 text-sky-600 group-hover:bg-sky-600 group-hover:text-white transition-colors">
                            <GraduationCap className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-900">
                              For Institutions
                            </div>
                            <div className="text-[11px] text-slate-500">
                              Placement analytics & university portals
                            </div>
                          </div>
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link
                href="/jobs"
                className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-white rounded-full transition-all duration-150"
              >
                Browse Jobs
              </Link>
            </>
          )}

          {role === "student" && (
            <>
              <Link
                href="/student/dashboard"
                className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-white rounded-full transition-all duration-150"
              >
                Dashboard
              </Link>
              <Link
                href="/jobs"
                className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-white rounded-full transition-all duration-150"
              >
                Browse Jobs
              </Link>
              <Link
                href="/student/applications"
                className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-white rounded-full transition-all duration-150"
              >
                Applications
              </Link>
              <Link
                href="/messages"
                className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-white rounded-full transition-all duration-150"
              >
                Messages
              </Link>
            </>
          )}

          {role === "employer" && (
            <>
              <Link
                href="/employer/dashboard"
                className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-white rounded-full transition-all duration-150"
              >
                Dashboard
              </Link>
              <Link
                href="/employer/jobs/new"
                className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-white rounded-full transition-all duration-150"
              >
                Post Job
              </Link>
              <Link
                href="/employer/jobs"
                className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-white rounded-full transition-all duration-150"
              >
                Jobs List
              </Link>
              <Link
                href="/messages"
                className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-white rounded-full transition-all duration-150"
              >
                Messages
              </Link>
            </>
          )}

          {role === "institution_admin" && (
            <>
              <Link
                href="/institution/dashboard"
                className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-white rounded-full transition-all duration-150"
              >
                Dashboard
              </Link>
              <Link
                href="/institution/students"
                className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-white rounded-full transition-all duration-150"
              >
                Students
              </Link>
              <Link
                href="/institution/events"
                className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-white rounded-full transition-all duration-150"
              >
                Events
              </Link>
            </>
          )}

          {role === "admin" && (
            <Link
              href="/admin/dashboard"
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-white rounded-full transition-all duration-150"
            >
              Admin Panel
            </Link>
          )}
        </nav>

        {/* Dynamic Auth / Action CTA */}
        <div className="hidden md:flex items-center gap-3">
          {userId ? (
            <div className="flex items-center gap-3">
              <NotificationBell userId={userId} />

              <span className="text-xs px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-bold capitalize border border-blue-100">
                {role?.replace("_", " ")}
              </span>

              <form action={signOutAction}>
                <Button
                  type="submit"
                  variant="outline"
                  size="sm"
                  className="gap-1.5"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Sign Out</span>
                </Button>
              </form>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/sign-in">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button variant="brand" size="sm" className="gap-1.5 shadow-md">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Get Started</span>
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          {userId && <NotificationBell userId={userId} />}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3"
          >
            <div className="flex flex-col gap-2">
              {!role && (
                <>
                  <Link
                    href="/for-students"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-xl"
                  >
                    For Students
                  </Link>
                  <Link
                    href="/for-employers"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-xl"
                  >
                    For Employers
                  </Link>
                  <Link
                    href="/for-institutions"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-xl"
                  >
                    For Institutions
                  </Link>
                  <Link
                    href="/jobs"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-xl"
                  >
                    Explore Jobs
                  </Link>
                </>
              )}

              {role === "student" && (
                <>
                  <Link href="/student/dashboard" onClick={() => setMobileMenuOpen(false)} className="p-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-xl">Dashboard</Link>
                  <Link href="/jobs" onClick={() => setMobileMenuOpen(false)} className="p-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-xl">Browse Jobs</Link>
                  <Link href="/student/applications" onClick={() => setMobileMenuOpen(false)} className="p-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-xl">Applications</Link>
                  <Link href="/messages" onClick={() => setMobileMenuOpen(false)} className="p-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-xl">Messages</Link>
                </>
              )}

              {role === "employer" && (
                <>
                  <Link href="/employer/dashboard" onClick={() => setMobileMenuOpen(false)} className="p-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-xl">Dashboard</Link>
                  <Link href="/employer/jobs/new" onClick={() => setMobileMenuOpen(false)} className="p-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-xl">Post Job</Link>
                  <Link href="/employer/jobs" onClick={() => setMobileMenuOpen(false)} className="p-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-xl">Jobs List</Link>
                  <Link href="/messages" onClick={() => setMobileMenuOpen(false)} className="p-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-xl">Messages</Link>
                </>
              )}

              {role === "institution_admin" && (
                <>
                  <Link href="/institution/dashboard" onClick={() => setMobileMenuOpen(false)} className="p-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-xl">Dashboard</Link>
                  <Link href="/institution/students" onClick={() => setMobileMenuOpen(false)} className="p-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-xl">Students</Link>
                  <Link href="/institution/events" onClick={() => setMobileMenuOpen(false)} className="p-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-xl">Events</Link>
                </>
              )}

              {role === "admin" && (
                <Link href="/admin/dashboard" onClick={() => setMobileMenuOpen(false)} className="p-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-xl">Admin Panel</Link>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              {userId ? (
                <form action={signOutAction}>
                  <Button type="submit" variant="outline" className="w-full justify-center">
                    Sign Out
                  </Button>
                </form>
              ) : (
                <>
                  <Link href="/sign-in" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full justify-center">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/sign-up" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="brand" className="w-full justify-center">
                      Get Started Free
                    </Button>
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
