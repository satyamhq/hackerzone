"use client";

import { useEffect, useState } from "react";
import { generateRequestId } from "@/lib/errors";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [requestId, setRequestId] = useState<string>("");

  useEffect(() => {
    const id = error.digest ? `HZ-REQ-${error.digest.slice(0, 8).toUpperCase()}` : generateRequestId();
    setRequestId(id);
    console.error(`[Hackerzone Root Global Error] Reference: ${id}`, error);
  }, [error]);

  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#0A0A0A] text-[#FAFAFA] font-sans antialiased flex flex-col justify-between m-0 p-0">
        <div className="border-b border-[#262626] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/hackerzone_logo.png"
              alt="Hackerzone"
              className="h-5 w-auto object-contain"
            />
            <span className="font-mono text-xs text-[#737373]">/ CRITICAL_FAULT</span>
          </div>
          <div className="flex items-center gap-2 font-mono text-[11px] text-red-400">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            ROOT_LAYOUT_EXCEPTION
          </div>
        </div>

        <main className="flex-1 flex items-center justify-center p-6 sm:p-12">
          <div className="max-w-lg w-full border border-[#262626] bg-[#141414] p-8 relative">
            <div className="h-1 bg-red-600 mb-6" />
            <h1 className="font-mono text-2xl uppercase tracking-wider text-[#FAFAFA] mb-3">
              Application Fault
            </h1>
            <p className="text-[#A3A3A3] text-sm leading-relaxed mb-6">
              A root level system error occurred. The application state has been safely halted to prevent data corruption.
            </p>

            <div className="mb-6 p-4 border border-[#262626] bg-[#0A0A0A] font-mono text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-[#737373]">REFERENCE:</span>
              <span className="text-[#FAFAFA] font-bold tracking-widest">{requestId || "HZ-REQ-CRITICAL"}</span>
            </div>

            <button
              onClick={() => reset()}
              type="button"
              className="w-full bg-[#FAFAFA] text-[#0A0A0A] py-3 font-mono text-xs uppercase tracking-wider font-semibold hover:bg-[#E5E5E5] transition-colors"
            >
              Restart Session
            </button>
          </div>
        </main>

        <footer className="border-t border-[#262626] px-6 py-4 text-center font-mono text-[11px] text-[#737373]">
          HACKERZONE SYSTEM STATUS: RECOVERABLE
        </footer>
      </body>
    </html>
  );
}
