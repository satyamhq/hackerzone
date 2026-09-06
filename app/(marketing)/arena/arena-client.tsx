"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Search,
  Trophy,
  Zap,
  Code2,
  ArrowRight,
  Star,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  points: number;
  skill_id: string | null;
  sponsor_company_id: string | null;
  skills: { name: string }[] | null;
  companies: { name: string; logo_url: string | null }[] | null;
}

interface Skill {
  id: string;
  name: string;
  category: string | null;
}

interface ArenaClientProps {
  challenges: Challenge[];
  skills: Skill[];
}

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: "bg-emerald-50 text-emerald-700 border-emerald-200",
  intermediate: "bg-blue-50 text-blue-700 border-blue-200",
  advanced: "bg-orange-50 text-orange-700 border-orange-200",
  expert: "bg-red-50 text-red-700 border-red-200",
};

export function ArenaClient({ challenges, skills }: ArenaClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);

  const filtered = challenges.filter((c) => {
    if (searchQuery && !c.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (selectedDifficulty && c.difficulty !== selectedDifficulty) return false;
    if (selectedSkill && c.skill_id !== selectedSkill) return false;
    return true;
  });

  return (
    <div className="space-y-0">
      {/* Dark Hero */}
      <section className="relative py-16 lg:py-24 bg-[#14151C] text-white overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#7AF3FF]/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-[#D3FB52]/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/15 text-xs font-bold uppercase tracking-widest text-[#D3FB52]">
            <Trophy className="h-4 w-4" />
            <span>Skill Arena</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight uppercase leading-[0.95]">
            PROVE YOUR
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#D3FB52] via-[#7AF3FF] to-white">
              AI SKILLS
            </span>
          </h1>

          <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto">
            Take challenges, earn verified badges, and stand out to employers
            with proof-of-work scores.
          </p>
        </div>
      </section>

      {/* Filters + Listing */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search challenges..."
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {["beginner", "intermediate", "advanced", "expert"].map((d) => (
              <button
                key={d}
                onClick={() => setSelectedDifficulty(selectedDifficulty === d ? null : d)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize border transition-colors ${
                  selectedDifficulty === d
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          {skills.length > 0 && (
            <select
              value={selectedSkill || ""}
              onChange={(e) => setSelectedSkill(e.target.value || null)}
              className="px-3 py-2 text-xs rounded-xl border border-gray-200 bg-white focus:outline-none"
            >
              <option value="">All Skills</option>
              {skills.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Challenge Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 space-y-4">
            <Code2 className="h-12 w-12 text-gray-300 mx-auto" />
            <p className="text-gray-500 text-sm">
              No challenges available yet. Check back soon.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((challenge) => (
              <Card
                key={challenge.id}
                hover
                className="p-6 flex flex-col justify-between space-y-5 border-slate-200/80"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase border ${
                        DIFFICULTY_COLORS[challenge.difficulty] || "bg-gray-50 text-gray-600"
                      }`}
                    >
                      {challenge.difficulty}
                    </span>
                    <span className="flex items-center gap-1 text-xs font-bold text-amber-600">
                      <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                      {challenge.points} pts
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 leading-snug">
                    {challenge.title}
                  </h3>

                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                    {challenge.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {challenge.skills?.[0]?.name && (
                      <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-[10px] font-semibold">
                        {challenge.skills[0].name}
                      </span>
                    )}
                    {challenge.companies?.[0]?.name && (
                      <span className="px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 text-[10px] font-semibold">
                        Sponsored by {challenge.companies[0].name}
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <Link href={`/arena/${challenge.id}`}>
                    <Button
                      variant="outline"
                      className="w-full justify-center gap-2 text-xs font-bold"
                    >
                      <span>Start Challenge</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
