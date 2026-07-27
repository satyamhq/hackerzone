"use client";

import Link from "next/link";
import { Briefcase, ArrowRight, Github, Twitter, Linkedin, ShieldCheck, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="border-t border-slate-200/80 bg-slate-900 text-slate-300 pt-16 pb-12 relative overflow-hidden">
      {/* Background Soft Glow circles */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-12 border-b border-slate-800">
          {/* Brand Info & Newsletter */}
          <div className="lg:col-span-5 space-y-6">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Briefcase className="h-5 w-5 stroke-[2.5]" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-white">
                Hackerzone
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-md">
              The premier three-sided career network for the Indian AI economy. Connecting engineering talent, top employers, and university placement centers.
            </p>

            {/* Newsletter Block */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider block">
                Subscribe to Tech Talent Insights
              </span>
              <form onSubmit={(e) => e.preventDefault()} className="flex gap-2 max-w-md">
                <input
                  type="email"
                  placeholder="Enter your work email"
                  className="bg-slate-800/90 border border-slate-700 text-white placeholder:text-slate-500 text-xs rounded-full px-4 py-2.5 focus:outline-none focus:border-blue-500 flex-1"
                />
                <Button variant="brand" size="sm" type="submit" className="gap-1 shadow-none">
                  <span>Join</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </form>
            </div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="text-xs font-extrabold uppercase tracking-wider text-white">
                Ecosystem
              </div>
              <ul className="space-y-2.5 text-xs text-slate-400">
                <li>
                  <Link href="/for-students" className="hover:text-white transition-colors">
                    For Students
                  </Link>
                </li>
                <li>
                  <Link href="/for-employers" className="hover:text-white transition-colors">
                    For Employers
                  </Link>
                </li>
                <li>
                  <Link href="/for-institutions" className="hover:text-white transition-colors">
                    For Institutions
                  </Link>
                </li>
                <li>
                  <Link href="/jobs" className="hover:text-white transition-colors">
                    Explore Job Board
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <div className="text-xs font-extrabold uppercase tracking-wider text-white">
                Platform
              </div>
              <ul className="space-y-2.5 text-xs text-slate-400">
                <li>
                  <Link href="/sign-in" className="hover:text-white transition-colors">
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link href="/sign-up" className="hover:text-white transition-colors">
                    Create Account
                  </Link>
                </li>
                <li>
                  <Link href="/forgot-password" className="hover:text-white transition-colors">
                    Reset Password
                  </Link>
                </li>
                <li>
                  <Link href="/messages" className="hover:text-white transition-colors">
                    Candidate Messaging
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <div className="text-xs font-extrabold uppercase tracking-wider text-white">
                Trust & Legal
              </div>
              <ul className="space-y-2.5 text-xs text-slate-400">
                <li>
                  <Link href="/privacy" className="hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <span className="inline-flex items-center gap-1.5 text-emerald-400 font-semibold text-[11px]">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    SOC2 & ISO Compliant
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Sub-footer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Hackerzone Technologies India. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1">
              Engineered with <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500" /> for India
            </span>
            <div className="flex items-center gap-3">
              <a href="#" className="hover:text-white transition-colors">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Linkedin className="h-4 w-4" />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Github className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
