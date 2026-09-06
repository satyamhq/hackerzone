"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Code2,
  Send,
  Star,
  Trophy,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

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

interface Submission {
  id: string;
  status: string;
  score: number | null;
  submitted_at: string;
}

interface ChallengeDetailClientProps {
  challenge: Challenge;
  existingSubmission: Submission | null;
  isAuthenticated: boolean;
}

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: "bg-emerald-50 text-emerald-700 border-emerald-200",
  intermediate: "bg-blue-50 text-blue-700 border-blue-200",
  advanced: "bg-orange-50 text-orange-700 border-orange-200",
  expert: "bg-red-50 text-red-700 border-red-200",
};

export function ChallengeDetailClient({
  challenge,
  existingSubmission,
  isAuthenticated,
}: ChallengeDetailClientProps) {
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submission, setSubmission] = useState<Submission | null>(existingSubmission);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    if (!isAuthenticated) return;
    if (!code.trim()) {
      setError("Please write your solution before submitting.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("You must be signed in to submit.");
        return;
      }

      const { data, error: submitError } = await supabase
        .from("submissions")
        .insert({
          user_id: user.id,
          challenge_id: challenge.id,
          code: code,
          status: "pending",
        })
        .select("id, status, score, submitted_at")
        .single();

      if (submitError) {
        if (submitError.code === "23505") {
          setError("You have already submitted a solution for this challenge.");
        } else {
          setError(submitError.message);
        }
        return;
      }

      setSubmission(data);
    } catch (e) {
      setError("An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-0">
      {/* Dark Header */}
      <section className="bg-[#14151C] text-white py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <Link
            href="/arena"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Skill Arena
          </Link>

          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span
                className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase border ${
                  DIFFICULTY_COLORS[challenge.difficulty] || "bg-gray-50 text-gray-600"
                }`}
              >
                {challenge.difficulty}
              </span>
              <span className="flex items-center gap-1 text-xs font-bold text-amber-400">
                <Star className="h-3.5 w-3.5 fill-amber-400" />
                {challenge.points} points
              </span>
              {challenge.skills?.[0]?.name && (
                <span className="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-semibold">
                  {challenge.skills[0].name}
                </span>
              )}
              {challenge.companies?.[0]?.name && (
                <span className="px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-semibold">
                  Sponsored by {challenge.companies[0].name}
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              {challenge.title}
            </h1>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Problem Statement */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="p-6 border-slate-200/80">
              <h2 className="text-lg font-bold text-slate-900 mb-4">
                Problem Statement
              </h2>
              <div className="prose prose-sm prose-slate max-w-none">
                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                  {challenge.description}
                </p>
              </div>
            </Card>

            {/* Code Editor Area */}
            {!submission ? (
              <Card className="p-6 border-slate-200/80 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Code2 className="h-5 w-5 text-blue-600" />
                    Your Solution
                  </h2>
                </div>

                <div className="rounded-xl overflow-hidden border border-slate-200">
                  <div className="bg-[#1e1e2e] px-4 py-2 flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500/80" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                      <div className="w-3 h-3 rounded-full bg-green-500/80" />
                    </div>
                    <span className="text-xs text-gray-400 ml-2">solution.py</span>
                  </div>
                  <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="# Write your solution here..."
                    className="w-full h-80 p-4 bg-[#1e1e2e] text-green-400 font-mono text-sm resize-none focus:outline-none"
                    spellCheck={false}
                  />
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 px-4 py-3 rounded-lg">
                    <XCircle className="h-4 w-4 shrink-0" />
                    {error}
                  </div>
                )}

                {!isAuthenticated ? (
                  <Link href="/sign-in">
                    <Button variant="default" className="w-full justify-center gap-2">
                      Sign in to Submit
                    </Button>
                  </Link>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    isLoading={submitting}
                    className="w-full justify-center gap-2"
                    variant="default"
                  >
                    <Send className="h-4 w-4" />
                    Submit Solution
                  </Button>
                )}
              </Card>
            ) : (
              <Card className="p-6 border-slate-200/80 space-y-4">
                <div className="flex items-center gap-3">
                  {submission.status === "passed" ? (
                    <div className="p-2 rounded-full bg-emerald-50">
                      <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                    </div>
                  ) : submission.status === "failed" ? (
                    <div className="p-2 rounded-full bg-red-50">
                      <XCircle className="h-6 w-6 text-red-600" />
                    </div>
                  ) : (
                    <div className="p-2 rounded-full bg-amber-50">
                      <Clock className="h-6 w-6 text-amber-600" />
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 capitalize">
                      {submission.status === "pending"
                        ? "Submission Pending Review"
                        : submission.status === "grading"
                        ? "Being Graded"
                        : submission.status === "passed"
                        ? "Challenge Passed!"
                        : "Challenge Not Passed"}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Submitted{" "}
                      {new Date(submission.submitted_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                {submission.score !== null && (
                  <div className="flex items-center gap-2 text-sm">
                    <Trophy className="h-4 w-4 text-amber-500" />
                    <span className="font-bold text-slate-900">
                      Score: {submission.score} / {challenge.points}
                    </span>
                  </div>
                )}
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="p-6 border-slate-200/80 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Challenge Info
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Difficulty</span>
                  <span className="font-semibold text-slate-900 capitalize">
                    {challenge.difficulty}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Points</span>
                  <span className="font-semibold text-slate-900">
                    {challenge.points}
                  </span>
                </div>
                {challenge.skills?.[0]?.name && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Skill</span>
                    <span className="font-semibold text-slate-900">
                      {challenge.skills[0].name}
                    </span>
                  </div>
                )}
              </div>
            </Card>

            {challenge.companies?.[0]?.name && (
              <Card className="p-6 border-purple-200/80 bg-purple-50/30 space-y-3">
                <h3 className="text-sm font-bold text-purple-900 uppercase tracking-wider">
                  Sponsored By
                </h3>
                <p className="text-sm font-semibold text-purple-800">
                  {challenge.companies[0].name}
                </p>
                <p className="text-xs text-purple-600">
                  Top performers may be contacted directly for opportunities.
                </p>
              </Card>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
