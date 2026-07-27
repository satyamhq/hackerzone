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
  Search,
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
          ? "bg-[#14151C]/90 backdrop-blur-md border-b border-white/10 shadow-2xl py-3 text-white"
          : "bg-[#14151C] border-b border-white/5 py-4 text-white"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group focus:outline-none"
        >
          <div className="h-10 w-10 rounded-2xl bg-[#D3FB52] text-[#052326] flex items-center justify-center font-extrabold shadow-md shadow-lime-500/20 group-hover:scale-105 transition-transform duration-200">
            <Briefcase className="h-5 w-5 stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-xl tracking-tight text-white leading-none">
              Hackerzone
            </span>
            <span className="text-[9px] font-bold uppercase tracking-widest text-[#D3FB52]">
              AI Career Network
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-white/5 p-1.5 rounded-2xl border border-white/10 backdrop-blur-md text-xs font-semibold">
          {!role && (
            <>
              {/* Product Solutions Trigger */}
              <div
                className="relative"
                onMouseEnter={() => setMegaMenuOpen(true)}
                onMouseLeave={() => setMegaMenuOpen(false)}
              >
                <button className="flex items-center gap-1.5 px-4 py-2 text-slate-200 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-150">
                  <span>Employers & Solutions</span>
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform duration-200 ${
                      megaMenuOpen ? "rotate-180 text-[#D3FB52]" : "text-slate-400"
                    }`}
                  />
                </button>

                {/* Dropdown Mega Menu */}
                <AnimatePresence>
                  {megaMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 mt-2 w-80 p-3 rounded-3xl bg-[#1C1D26] border border-white/15 shadow-2xl shadow-black/50 z-50 text-white"
                    >
                      <div className="space-y-1">
                        <Link
                          href="/for-students"
                          className="flex items-start gap-3 p-3 rounded-2xl hover:bg-white/5 transition-colors group"
                        >
                          <div className="p-2 rounded-xl bg-blue-500/10 text-[#7AF3FF] group-hover:bg-[#7AF3FF] group-hover:text-black transition-colors">
                            <UserCheck className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-white">
                              For Job Seekers & Students
                            </div>
                            <div className="text-[11px] text-slate-400">
                              Verified AI profiles & direct interviews
                            </div>
                          </div>
                        </Link>

                        <Link
                          href="/for-employers"
                          className="flex items-start gap-3 p-3 rounded-2xl hover:bg-white/5 transition-colors group"
                        >
                          <div className="p-2 rounded-xl bg-lime-500/10 text-[#D3FB52] group-hover:bg-[#D3FB52] group-hover:text-black transition-colors">
                            <Building2 className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-white">
                              For Employers
                            </div>
                            <div className="text-[11px] text-slate-400">
                              Hire early talent and AI specialists
                            </div>
                          </div>
                        </Link>

                        <Link
                          href="/for-institutions"
                          className="flex items-start gap-3 p-3 rounded-2xl hover:bg-white/5 transition-colors group"
                        >
                          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-400 group-hover:text-black transition-colors">
                            <GraduationCap className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-white">
                              For Career Centers
                            </div>
                            <div className="text-[11px] text-slate-400">
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
                href="/for-students"
                className="px-4 py-2 text-slate-200 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-150"
              >
                Job Seekers
              </Link>
              <Link
                href="/for-employers"
                className="px-4 py-2 text-slate-200 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-150"
              >
                Employers
              </Link>
              <Link
                href="/for-institutions"
                className="px-4 py-2 text-slate-200 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-150"
              >
                Career Centers
              </Link>
              <Link
                href="/jobs"
                className="px-4 py-2 text-slate-200 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-150"
              >
                Explore Jobs
              </Link>
            </>
          )}

          {role === "student" && (
            <>
              <Link href="/student/dashboard" className="px-4 py-2 text-slate-200 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-150">
                Dashboard
              </Link>
              <Link href="/jobs" className="px-4 py-2 text-slate-200 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-150">
                Browse Jobs
              </Link>
              <Link href="/student/applications" className="px-4 py-2 text-slate-200 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-150">
                Applications
              </Link>
              <Link href="/messages" className="px-4 py-2 text-slate-200 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-150">
                Messages
              </Link>
            </>
          )}

          {role === "employer" && (
            <>
              <Link href="/employer/dashboard" className="px-4 py-2 text-slate-200 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-150">
                Dashboard
              </Link>
              <Link href="/employer/jobs/new" className="px-4 py-2 text-slate-200 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-150">
                Post Job
              </Link>
              <Link href="/employer/jobs" className="px-4 py-2 text-slate-200 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-150">
                Jobs List
              </Link>
              <Link href="/messages" className="px-4 py-2 text-slate-200 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-150">
                Messages
              </Link>
            </>
          )}

          {role === "institution_admin" && (
            <>
              <Link href="/institution/dashboard" className="px-4 py-2 text-slate-200 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-150">
                Dashboard
              </Link>
              <Link href="/institution/students" className="px-4 py-2 text-slate-200 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-150">
                Students
              </Link>
              <Link href="/institution/events" className="px-4 py-2 text-slate-200 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-150">
                Events
              </Link>
            </>
          )}

          {role === "admin" && (
            <Link href="/admin/dashboard" className="px-4 py-2 text-slate-200 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-150">
              Admin Panel
            </Link>
          )}
        </nav>

        {/* Auth CTAs */}
        <div className="hidden md:flex items-center gap-3">
          {userId ? (
            <div className="flex items-center gap-3">
              <NotificationBell userId={userId} />
              <span className="text-xs px-3 py-1 rounded-full bg-[#D3FB52]/10 text-[#D3FB52] font-bold capitalize border border-[#D3FB52]/20">
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
                <Button variant="dark" size="sm" className="bg-transparent border-white/20 hover:bg-white/10">
                  Log in
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button variant="lime" size="sm" className="gap-1.5">
                  <span>Sign up</span>
                </Button>
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
            className="md:hidden bg-[#14151C] border-b border-white/10 px-4 pt-3 pb-6 space-y-3"
          >
            <div className="flex flex-col gap-2 text-sm font-semibold">
              {!role && (
                <>
                  <Link href="/for-students" onClick={() => setMobileMenuOpen(false)} className="p-2.5 hover:bg-white/5 rounded-xl text-slate-200">
                    For Job Seekers
                  </Link>
                  <Link href="/for-employers" onClick={() => setMobileMenuOpen(false)} className="p-2.5 hover:bg-white/5 rounded-xl text-slate-200">
                    For Employers
                  </Link>
                  <Link href="/for-institutions" onClick={() => setMobileMenuOpen(false)} className="p-2.5 hover:bg-white/5 rounded-xl text-slate-200">
                    For Career Centers
                  </Link>
                  <Link href="/jobs" onClick={() => setMobileMenuOpen(false)} className="p-2.5 hover:bg-white/5 rounded-xl text-slate-200">
                    Explore Jobs
                  </Link>
                </>
              )}

              {role === "student" && (
                <>
                  <Link href="/student/dashboard" onClick={() => setMobileMenuOpen(false)} className="p-2.5 hover:bg-white/5 rounded-xl">Dashboard</Link>
                  <Link href="/jobs" onClick={() => setMobileMenuOpen(false)} className="p-2.5 hover:bg-white/5 rounded-xl">Browse Jobs</Link>
                  <Link href="/student/applications" onClick={() => setMobileMenuOpen(false)} className="p-2.5 hover:bg-white/5 rounded-xl">Applications</Link>
                  <Link href="/messages" onClick={() => setMobileMenuOpen(false)} className="p-2.5 hover:bg-white/5 rounded-xl">Messages</Link>
                </>
              )}

              {role === "employer" && (
                <>
                  <Link href="/employer/dashboard" onClick={() => setMobileMenuOpen(false)} className="p-2.5 hover:bg-white/5 rounded-xl">Dashboard</Link>
                  <Link href="/employer/jobs/new" onClick={() => setMobileMenuOpen(false)} className="p-2.5 hover:bg-white/5 rounded-xl">Post Job</Link>
                  <Link href="/employer/jobs" onClick={() => setMobileMenuOpen(false)} className="p-2.5 hover:bg-white/5 rounded-xl">Jobs List</Link>
                  <Link href="/messages" onClick={() => setMobileMenuOpen(false)} className="p-2.5 hover:bg-white/5 rounded-xl">Messages</Link>
                </>
              )}

              {role === "institution_admin" && (
                <>
                  <Link href="/institution/dashboard" onClick={() => setMobileMenuOpen(false)} className="p-2.5 hover:bg-white/5 rounded-xl">Dashboard</Link>
                  <Link href="/institution/students" onClick={() => setMobileMenuOpen(false)} className="p-2.5 hover:bg-white/5 rounded-xl">Students</Link>
                  <Link href="/institution/events" onClick={() => setMobileMenuOpen(false)} className="p-2.5 hover:bg-white/5 rounded-xl">Events</Link>
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
                    <Button variant="dark" className="w-full justify-center">
                      Log in
                    </Button>
                  </Link>
                  <Link href="/sign-up" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="lime" className="w-full justify-center">
                      Sign up
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
