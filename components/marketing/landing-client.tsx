"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowUpRight } from "lucide-react";

export function LandingClient() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/jobs?query=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/jobs");
    }
  }

  return (
    <section className="relative flex flex-col items-center justify-center min-h-[calc(100vh-72px)] px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Charcoal radial gradient — lighter center glow, black edges */}
      <div className="absolute inset-0 hero-gradient" />

      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
        {/* Main Headline — Bold condensed italic per §6.2 */}
        <h1 className="font-display text-5xl sm:text-7xl lg:text-[96px] tracking-tight leading-[0.9] text-white">
          LET&apos;S BUILD YOUR
          <br />
          AI-POWERED CAREER
        </h1>

        {/* Subtitle — light gray, one line */}
        <p className="text-base sm:text-lg text-[#A3A3A3] max-w-2xl mx-auto leading-relaxed">
          Companies ready to hire. AI specialist roles across all levels.
        </p>

        {/* Search Bar as primary CTA — §6.5 */}
        <form
          onSubmit={handleSearchSubmit}
          className="relative max-w-2xl mx-auto pt-2"
        >
          <div className="relative flex items-center bg-white rounded-full p-1.5 shadow-2xl shadow-black/60">
            <Search className="h-5 w-5 text-[#A3A3A3] ml-4 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search jobs, companies, skills..."
              className="w-full h-12 pl-3 pr-16 text-[#111111] placeholder:text-[#A3A3A3] text-base font-medium bg-transparent focus:outline-none"
            />
            <button
              type="submit"
              className="absolute right-2 h-10 w-10 flex items-center justify-center rounded-full bg-[#111111] hover:bg-black transition-colors"
              aria-label="Search"
            >
              <ArrowUpRight className="h-5 w-5 text-white" />
            </button>
          </div>
        </form>

        {/* Quick-filter pills — dark fill + light border per §6.5 */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
          {["AI Specialists", "Full-time", "Remote", "Internship", "Skill-Verified Only"].map(
            (label) => (
              <button
                key={label}
                onClick={() =>
                  router.push(
                    `/jobs?query=${encodeURIComponent(label)}`
                  )
                }
                className="px-4 py-2 rounded-full border border-[#3F3F3F] bg-white/5 hover:bg-white hover:text-black transition-all text-sm text-white font-medium"
              >
                {label}
              </button>
            )
          )}
        </div>
      </div>
    </section>
  );
}
