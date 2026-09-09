"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { generateRequestId } from "@/lib/errors";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorBoundary({ error, reset }: ErrorProps) {
  const [requestId, setRequestId] = useState<string>("");

  useEffect(() => {
    // Generate correlation ID for client-side diagnostic tracing
    const id = error.digest ? `HZ-REQ-${error.digest.slice(0, 8).toUpperCase()}` : generateRequestId();
    setRequestId(id);
    console.error(`[Hackerzone Error Boundary] Reference: ${id}`, error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#FAFAFA] flex flex-col justify-between selection:bg-[#FAFAFA] selection:text-[#0A0A0A]">
      <div className="border-b border-[#262626] px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-mono text-xs tracking-wider uppercase text-[#A3A3A3] hover:text-[#FAFAFA] transition-colors">
          HACKERZONE.IN / ERROR
        </Link>
        <div className="flex items-center gap-2 font-mono text-[11px] text-[#737373]">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          SYSTEM_RECOVERABLE
        </div>
      </div>

      <main className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="max-w-xl w-full border border-[#262626] bg-[#141414] p-8 sm:p-12 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-red-500" />

          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 border border-[#262626] bg-[#1C1C1C] flex items-center justify-center text-red-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <span className="font-mono text-xs text-[#737373] tracking-widest uppercase">APPLICATION FAULT</span>
              <p className="font-mono text-[11px] text-[#A3A3A3]">SOMETHING WENT WRONG</p>
            </div>
          </div>

          <h1 className="font-heading text-3xl sm:text-4xl uppercase tracking-wider text-[#FAFAFA] mb-3">
            Something went wrong
          </h1>

          <p className="text-[#A3A3A3] text-sm leading-relaxed mb-6">
            An unexpected error occurred while processing this view. Your session and drafts are preserved. Please retry or navigate back to safety.
          </p>

          {/* Reference Request ID per §12 */}
          <div className="mb-8 p-4 border border-[#262626] bg-[#0A0A0A] font-mono text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-[#737373] uppercase tracking-wider">DIAGNOSTIC REFERENCE:</span>
            <span className="text-[#FAFAFA] font-bold tracking-widest">{requestId || "HZ-REQ-INITIALIZING"}</span>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <button
              onClick={() => reset()}
              type="button"
              className="inline-flex items-center justify-center gap-2 bg-[#FAFAFA] text-[#0A0A0A] px-6 py-3 font-mono text-xs uppercase tracking-wider font-semibold hover:bg-[#E5E5E5] transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Retry Operation
            </button>

            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 border border-[#262626] bg-[#1C1C1C] text-[#FAFAFA] px-6 py-3 font-mono text-xs uppercase tracking-wider hover:border-[#FAFAFA] transition-colors"
            >
              <Home className="w-4 h-4" />
              Go Home
            </Link>
          </div>

          <div className="mt-10 pt-6 border-t border-[#262626] flex items-center justify-between font-mono text-[11px] text-[#737373]">
            <span>SYSTEM: HZ-PRODUCTION</span>
            <span>STATUS: RECOVERY_READY</span>
          </div>
        </div>
      </main>

      <footer className="border-t border-[#262626] px-6 py-4 text-center font-mono text-[11px] text-[#737373]">
        HACKERZONE &bull; THE HUMAN INTELLIGENCE NETWORK POWERING THE AI ECONOMY
      </footer>
    </div>
  );
}
