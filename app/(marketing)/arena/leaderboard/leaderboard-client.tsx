"use client";

import Link from "next/link";
import { Trophy, Medal, ArrowLeft, Crown } from "lucide-react";
import { Card } from "@/components/ui/card";

interface Leader {
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
  total_score: number;
  challenges_passed: number;
}

interface LeaderboardClientProps {
  leaders: Leader[];
  skills: { id: string; name: string }[];
}

export function LeaderboardClient({ leaders, skills }: LeaderboardClientProps) {
  return (
    <div className="space-y-0">
      {/* Dark Header */}
      <section className="bg-[#14151C] text-white py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <Link
            href="/arena"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Skill Arena
          </Link>

          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-amber-500/20">
              <Trophy className="h-8 w-8 text-amber-400" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight">
                Leaderboard
              </h1>
              <p className="text-sm text-gray-400">
                Top performers across all Skill Arena challenges
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Table */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {leaders.length === 0 ? (
          <div className="text-center py-20 space-y-4">
            <Medal className="h-12 w-12 text-gray-300 mx-auto" />
            <p className="text-gray-500 text-sm">
              No submissions yet. Be the first to complete a challenge!
            </p>
          </div>
        ) : (
          <Card className="overflow-hidden border-slate-200/80">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="text-left text-xs font-bold text-slate-500 uppercase tracking-wider px-6 py-3 w-16">
                    Rank
                  </th>
                  <th className="text-left text-xs font-bold text-slate-500 uppercase tracking-wider px-6 py-3">
                    Developer
                  </th>
                  <th className="text-right text-xs font-bold text-slate-500 uppercase tracking-wider px-6 py-3">
                    Challenges
                  </th>
                  <th className="text-right text-xs font-bold text-slate-500 uppercase tracking-wider px-6 py-3">
                    Total Score
                  </th>
                </tr>
              </thead>
              <tbody>
                {leaders.map((leader, idx) => (
                  <tr
                    key={leader.user_id}
                    className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      {idx === 0 ? (
                        <Crown className="h-5 w-5 text-amber-500 fill-amber-500" />
                      ) : idx === 1 ? (
                        <Medal className="h-5 w-5 text-slate-400" />
                      ) : idx === 2 ? (
                        <Medal className="h-5 w-5 text-amber-700" />
                      ) : (
                        <span className="text-sm font-bold text-slate-400">
                          {idx + 1}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 overflow-hidden">
                          {leader.avatar_url ? (
                            <img
                              src={leader.avatar_url}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            (leader.full_name || "?").charAt(0).toUpperCase()
                          )}
                        </div>
                        <span className="text-sm font-semibold text-slate-900">
                          {leader.full_name || "Anonymous"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium text-slate-600">
                      {leader.challenges_passed}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-sm font-bold text-slate-900">
                        {leader.total_score.toLocaleString()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}
      </section>
    </div>
  );
}
