"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Home, ShieldAlert } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#FAFAFA] flex flex-col justify-between selection:bg-[#FAFAFA] selection:text-[#0A0A0A]">
      {/* Top micro status bar */}
      <div className="border-b border-[#262626] px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-mono text-xs tracking-wider uppercase text-[#A3A3A3] hover:text-[#FAFAFA] transition-colors">
          HACKERZONE.IN / 404
        </Link>
        <div className="flex items-center gap-2 font-mono text-[11px] text-[#737373]">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500/80 animate-pulse" />
          ROUTE_NOT_FOUND
        </div>
      </div>

      {/* Center main error container */}
      <main className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="max-w-xl w-full border border-[#262626] bg-[#141414] p-8 sm:p-12 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#FAFAFA]" />
          
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 border border-[#262626] bg-[#1C1C1C] flex items-center justify-center text-[#FAFAFA]">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <span className="font-mono text-xs text-[#737373] tracking-widest uppercase">ERROR CODE 404</span>
              <p className="font-mono text-[11px] text-[#A3A3A3]">RESOURCE_UNAVAILABLE</p>
            </div>
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl uppercase tracking-wider text-[#FAFAFA] mb-4">
            Page Not Found
          </h1>

          <p className="text-[#A3A3A3] text-sm sm:text-base leading-relaxed mb-8">
            The page you&apos;re looking for doesn&apos;t exist, was retired, or may have moved to a new destination in the human intelligence network.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 bg-[#FAFAFA] text-[#0A0A0A] px-6 py-3 font-mono text-xs uppercase tracking-wider font-semibold hover:bg-[#E5E5E5] transition-colors"
            >
              <Home className="w-4 h-4" />
              Go Home
            </Link>

            <button
              onClick={() => router.back()}
              type="button"
              className="inline-flex items-center justify-center gap-2 border border-[#262626] bg-[#1C1C1C] text-[#FAFAFA] px-6 py-3 font-mono text-xs uppercase tracking-wider hover:border-[#FAFAFA] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </button>
          </div>

          {/* Diagnostic metadata box */}
          <div className="mt-10 pt-6 border-t border-[#262626] flex items-center justify-between font-mono text-[11px] text-[#737373]">
            <span>SYSTEM: HZ-PRODUCTION</span>
            <span>STATUS: 404_PAGE_NOT_FOUND</span>
          </div>
        </div>
      </main>

      {/* Minimal footer */}
      <footer className="border-t border-[#262626] px-6 py-4 text-center font-mono text-[11px] text-[#737373]">
        HACKERZONE &bull; THE HUMAN INTELLIGENCE NETWORK POWERING THE AI ECONOMY
      </footer>
    </div>
  );
}
