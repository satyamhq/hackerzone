"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Shield, Terminal, Globe2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-[#3F3F3F]/60 bg-[#0A0A0A] text-[#A3A3A3] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section: Brand Statement & Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-14 border-b border-[#3F3F3F]/40">
          <div className="lg:col-span-5 space-y-5">
            <Link href="/" className="inline-block">
              <Image
                src="/hackerzone-logo.svg"
                alt="Hackerzone"
                width={160}
                height={36}
                className="h-7 sm:h-8 w-auto"
              />
            </Link>
            <p className="text-sm text-[#A3A3A3] leading-relaxed max-w-md">
              The human intelligence network powering the AI economy. Discover, verify, and deploy human expertise to train, evaluate, and supervise AI.
            </p>
            <div className="flex items-center gap-4 text-xs text-[#A3A3A3] pt-1">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-white font-medium">Global Network Live</span>
              </div>
              <span className="text-white/20">|</span>
              <span>12,000+ Verified Humans</span>
              <span className="text-white/20">|</span>
              <span>Enterprise Grade</span>
            </div>

            {/* Newsletter Block */}
            <div className="space-y-2.5 pt-3">
              <span className="text-xs font-bold text-white uppercase tracking-wider block">
                Subscribe to Human Intelligence in AI Briefing
              </span>
              <form onSubmit={(e) => e.preventDefault()} className="flex gap-2 max-w-md">
                <input
                  type="email"
                  placeholder="Enter your work email"
                  className="bg-white/5 border border-[#3F3F3F] text-white placeholder:text-[#A3A3A3] text-xs rounded-full px-4 py-2.5 focus:outline-none focus:border-white flex-1"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold text-[#0A0A0A] bg-white rounded-full hover:bg-gray-200 transition-colors gap-1 inline-flex items-center"
                >
                  <span>Subscribe</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </form>
            </div>
          </div>

          {/* 5 Master Columns per §52 */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-5 gap-6 sm:gap-4">
            {/* 1. Platform */}
            <div className="space-y-3">
              <div className="text-xs font-extrabold uppercase tracking-wider text-white">
                Platform
              </div>
              <ul className="space-y-2 text-xs text-[#A3A3A3]">
                <li><Link href="/jobs" className="hover:text-white transition-colors">Experts</Link></li>
                <li><Link href="/jobs" className="hover:text-white transition-colors">Projects</Link></li>
                <li><Link href="/for-employers" className="hover:text-white transition-colors">Enterprise</Link></li>
                <li><Link href="/arena" className="hover:text-white transition-colors">AI Evaluation</Link></li>
                <li><Link href="/jobs?category=ai-training" className="hover:text-white transition-colors">AI Training</Link></li>
              </ul>
            </div>

            {/* 2. Experts */}
            <div className="space-y-3">
              <div className="text-xs font-extrabold uppercase tracking-wider text-white">
                Experts
              </div>
              <ul className="space-y-2 text-xs text-[#A3A3A3]">
                <li><Link href="/sign-up" className="hover:text-white transition-colors">Join Hackerzone</Link></li>
                <li><Link href="/jobs" className="hover:text-white transition-colors">Find Projects</Link></li>
                <li><Link href="/for-students" className="hover:text-white transition-colors">Verification</Link></li>
                <li><Link href="/for-students" className="hover:text-white transition-colors">Payments</Link></li>
                <li><Link href="/about" className="hover:text-white transition-colors">Help</Link></li>
              </ul>
            </div>

            {/* 3. Company */}
            <div className="space-y-3">
              <div className="text-xs font-extrabold uppercase tracking-wider text-white">
                Company
              </div>
              <ul className="space-y-2 text-xs text-[#A3A3A3]">
                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="/about" className="hover:text-white transition-colors">Careers</Link></li>
                <li><Link href="/about" className="hover:text-white transition-colors">Press</Link></li>
                <li><Link href="/for-employers" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="/about" className="hover:text-white transition-colors">Status</Link></li>
              </ul>
            </div>

            {/* 4. Resources */}
            <div className="space-y-3">
              <div className="text-xs font-extrabold uppercase tracking-wider text-white">
                Resources
              </div>
              <ul className="space-y-2 text-xs text-[#A3A3A3]">
                <li><Link href="/about" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="/about" className="hover:text-white transition-colors">Research</Link></li>
                <li><Link href="/for-students" className="hover:text-white transition-colors">Guides</Link></li>
                <li><Link href="/for-employers" className="hover:text-white transition-colors">Case Studies</Link></li>
                <li><Link href="/about" className="hover:text-white transition-colors">Help Center</Link></li>
              </ul>
            </div>

            {/* 5. Legal */}
            <div className="space-y-3">
              <div className="text-xs font-extrabold uppercase tracking-wider text-white">
                Legal
              </div>
              <ul className="space-y-2 text-xs text-[#A3A3A3]">
                <li><Link href="/legal/terms" className="hover:text-white transition-colors">Terms</Link></li>
                <li><Link href="/legal/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
                <li><Link href="/legal/privacy" className="hover:text-white transition-colors">Cookies</Link></li>
                <li><Link href="/legal/terms" className="hover:text-white transition-colors">Expert Agreement</Link></li>
                <li><Link href="/legal/privacy" className="hover:text-white transition-colors">Security</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#A3A3A3]">
          <p>© {new Date().getFullYear()} Hackerzone. All rights reserved. The human intelligence network powering the AI economy.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-white transition-colors">hackerzone.in</span>
            <span>·</span>
            <span className="hover:text-white transition-colors">Enterprise RBAC</span>
            <span>·</span>
            <span className="hover:text-white transition-colors">SOC2 Compliant Architecture</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
