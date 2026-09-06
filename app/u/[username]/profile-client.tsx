"use client";

import Link from "next/link";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import {
  Award,
  Calendar,
  CheckCircle2,
  ExternalLink,
  Globe,
  Lock,
  MapPin,
  Share2,
  Shield,
  Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: string;
  created_at: string;
}

interface Student {
  headline: string | null;
  bio: string | null;
  skills: string[];
  links: Record<string, string>;
  location: string | null;
  graduation_year: number | null;
  is_public: boolean;
}

interface UserSkill {
  verified_score: number;
  badge_tier: string | null;
  verified_at: string | null;
  skills: { name: string }[] | null;
}

interface Submission {
  id: string;
  score: number | null;
  status: string;
  submitted_at: string;
  challenges: { title: string; points: number; difficulty: string }[] | null;
}

interface ProfileClientProps {
  profile: Profile;
  student: Student | null;
  userSkills: UserSkill[];
  submissions: Submission[];
  isPublic: boolean;
}

const BADGE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  bronze: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" },
  silver: { bg: "bg-slate-50", text: "text-slate-600", border: "border-slate-300" },
  gold: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-300" },
  platinum: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-300" },
};

export function ProfileClient({
  profile,
  student,
  userSkills,
  submissions,
  isPublic,
}: ProfileClientProps) {
  function handleShare() {
    if (navigator.share) {
      navigator.share({
        title: `${profile.full_name} — Hackerzone`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#FAFBFC]">
      <Navbar />
      <main className="flex-1">
        {/* Profile Header */}
        <section className="bg-[#14151C] text-white py-12">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-start gap-6">
              <div className="h-20 w-20 rounded-2xl bg-slate-700 flex items-center justify-center text-2xl font-bold text-white overflow-hidden shrink-0">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  (profile.full_name || "?").charAt(0).toUpperCase()
                )}
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                    {profile.full_name || "Anonymous Developer"}
                  </h1>
                  {userSkills.length > 0 && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                      <Shield className="h-3 w-3" />
                      Verified Skills
                    </span>
                  )}
                </div>

                {student?.headline && (
                  <p className="text-gray-300 text-sm">{student.headline}</p>
                )}

                <div className="flex items-center gap-4 text-xs text-gray-400">
                  {student?.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {student.location}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    Joined{" "}
                    {new Date(profile.created_at).toLocaleDateString("en-IN", {
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>

              <Button
                onClick={handleShare}
                variant="dark"
                size="sm"
                className="gap-2 shrink-0"
              >
                <Share2 className="h-3.5 w-3.5" />
                Share
              </Button>
            </div>
          </div>
        </section>

        {!isPublic ? (
          <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-4">
            <Lock className="h-12 w-12 text-gray-300 mx-auto" />
            <p className="text-gray-500 text-sm">
              This profile is set to private.
            </p>
          </section>
        ) : (
          <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Bio */}
                {student?.bio && (
                  <Card className="p-6 border-slate-200/80">
                    <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
                      About
                    </h2>
                    <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                      {student.bio}
                    </p>
                  </Card>
                )}

                {/* Verified Skill Badges */}
                {userSkills.length > 0 && (
                  <Card className="p-6 border-slate-200/80">
                    <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
                      Verified Skills
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {userSkills.map((us, idx) => {
                        const colors =
                          BADGE_COLORS[us.badge_tier || "bronze"] ||
                          BADGE_COLORS.bronze;
                        return (
                          <div
                            key={idx}
                            className={`flex items-center justify-between p-3 rounded-xl border ${colors.bg} ${colors.border}`}
                          >
                            <div className="flex items-center gap-2">
                              <Award
                                className={`h-4 w-4 ${colors.text}`}
                              />
                              <span
                                className={`text-sm font-semibold ${colors.text}`}
                              >
                                {us.skills?.[0]?.name || "Skill"}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-xs font-bold uppercase ${colors.text}`}
                              >
                                {us.badge_tier || "—"}
                              </span>
                              <span className="text-xs font-mono text-slate-500">
                                {us.verified_score}pts
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </Card>
                )}

                {/* Submission History */}
                {submissions.length > 0 && (
                  <Card className="p-6 border-slate-200/80">
                    <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
                      Challenge History
                    </h2>
                    <div className="space-y-3">
                      {submissions.map((sub) => (
                        <div
                          key={sub.id}
                          className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0"
                        >
                          <div className="flex items-center gap-3">
                            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                            <div>
                              <p className="text-sm font-semibold text-slate-900">
                                {sub.challenges?.[0]?.title || "Challenge"}
                              </p>
                              <p className="text-[10px] text-slate-400 capitalize">
                                {sub.challenges?.[0]?.difficulty} · {sub.challenges?.[0]?.points} pts
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-slate-900">
                              {sub.score || 0}
                            </p>
                            <p className="text-[10px] text-slate-400">
                              {new Date(sub.submitted_at).toLocaleDateString("en-IN", {
                                month: "short",
                                day: "numeric",
                              })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Skills Tags */}
                {student?.skills && student.skills.length > 0 && (
                  <Card className="p-6 border-slate-200/80">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
                      Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {student.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </Card>
                )}

                {/* External Links */}
                {student?.links &&
                  Object.keys(student.links).length > 0 && (
                    <Card className="p-6 border-slate-200/80">
                      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
                        Links
                      </h3>
                      <div className="space-y-2">
                        {Object.entries(student.links).map(
                          ([label, url]) => (
                            <a
                              key={label}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                              {label}
                            </a>
                          )
                        )}
                      </div>
                    </Card>
                  )}

                {student?.graduation_year && (
                  <Card className="p-6 border-slate-200/80">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
                      Education
                    </h3>
                    <p className="text-sm text-slate-600">
                      Graduating {student.graduation_year}
                    </p>
                  </Card>
                )}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
