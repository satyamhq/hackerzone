"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Github, Twitter, Linkedin, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-[#3F3F3F] bg-[#0A0A0A] text-[#A3A3A3] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-12 border-b border-[#3F3F3F]">
          {/* Brand Info & Newsletter */}
          <div className="lg:col-span-5 space-y-6">
            <Link href="/" className="inline-block">
              <Image
                src="/hackerzone-logo.svg"
                alt="Hackerzone"
                width={160}
                height={36}
                className="h-8 w-auto"
              />
            </Link>
            <p className="text-sm text-[#A3A3A3] leading-relaxed max-w-md">
              The career network for the Indian AI economy. Connecting engineering talent, top tech employers, and university career centers.
            </p>

            {/* Newsletter Block */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider block">
                Subscribe to AI Talent Insights
              </span>
              <form onSubmit={(e) => e.preventDefault()} className="flex gap-2 max-w-md">
                <input
                  type="email"
                  placeholder="Enter your work email"
                  className="bg-white/5 border border-[#3F3F3F] text-white placeholder:text-[#A3A3A3] text-xs rounded-full px-4 py-2.5 focus:outline-none focus:border-white flex-1"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 text-xs font-bold text-[#0A0A0A] bg-white rounded-full hover:bg-gray-100 transition-colors gap-1 inline-flex items-center"
                >
                  <span>Join</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </form>
            </div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="text-xs font-extrabold uppercase tracking-wider text-white">
                Solutions
              </div>
              <ul className="space-y-2.5 text-xs text-[#A3A3A3]">
                <li>
                  <Link href="/for-students" className="hover:text-white transition-colors">
                    For Job Seekers
                  </Link>
                </li>
                <li>
                  <Link href="/for-employers" className="hover:text-white transition-colors">
                    For Employers
                  </Link>
                </li>
                <li>
                  <Link href="/for-institutions" className="hover:text-white transition-colors">
                    For Career Centers
                  </Link>
                </li>
                <li>
                  <Link href="/arena" className="hover:text-white transition-colors">
                    Skill Arena
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
                Account
              </div>
              <ul className="space-y-2.5 text-xs text-[#A3A3A3]">
                <li>
                  <Link href="/sign-in" className="hover:text-white transition-colors">
                    Log in
                  </Link>
                </li>
                <li>
                  <Link href="/sign-up" className="hover:text-white transition-colors">
                    Sign up
                  </Link>
                </li>
                <li>
                  <Link href="/forgot-password" className="hover:text-white transition-colors">
                    Reset Password
                  </Link>
                </li>
                <li>
                  <Link href="/messages" className="hover:text-white transition-colors">
                    Direct Messaging
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <div className="text-xs font-extrabold uppercase tracking-wider text-white">
                Legal
              </div>
              <ul className="space-y-2.5 text-xs text-[#A3A3A3]">
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
              </ul>
            </div>
          </div>
        </div>

        {/* Sub-footer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#A3A3A3]">
          <p>© {new Date().getFullYear()} Hackerzone Technologies India. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1">
              Engineered with <Heart className="h-3.5 w-3.5 text-white fill-white" /> for India
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
