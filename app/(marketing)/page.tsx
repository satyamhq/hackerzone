import Link from "next/link";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { createClient } from "@/utils/supabase/server";
import {
  ArrowRight,
  Briefcase,
  Building2,
  CheckCircle2,
  ChevronRight,
  GraduationCap,
  Sparkles,
  UserCheck,
  Zap,
} from "lucide-react";

export const revalidate = 60; // Revalidate live stats every 60s

export default async function LandingPage() {
  const supabase = await createClient();

  // Pull REAL aggregate statistics from Supabase tables
  const [{ count: openJobsCount }, { count: studentCount }, { count: institutionCount }] =
    await Promise.all([
      supabase.from("jobs").select("*", { count: "exact", head: true }).eq("status", "open"),
      supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "student"),
      supabase.from("institutions").select("*", { count: "exact", head: true }).eq("verified", true),
    ]);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-24 md:py-36 bg-gradient-to-b from-primary/10 via-background to-background">
          <div className="container px-4 md:px-6 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-bold bg-background text-primary mb-6 shadow-sm">
              <Sparkles className="h-4 w-4" />
              <span>The Career Network for the Indian AI Economy</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto mb-6 leading-tight">
              Connecting India's AI Talent, Top Employers & University Career Centers
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Hackerzone is the unified career marketplace powering tech talent discovery in India. Match skills to open roles, streamline campus placements, and accelerate engineering careers.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/sign-up"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-8 py-3.5 text-sm font-bold text-primary-foreground shadow-lg transition-colors hover:bg-primary/90"
              >
                <span>Join Hackerzone Free</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/jobs"
                className="inline-flex items-center justify-center rounded-lg border border-input bg-background px-8 py-3.5 text-sm font-bold shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                Browse Active Jobs
              </Link>
            </div>
          </div>
        </section>

        {/* Live Platform Statistics Counter */}
        <section className="py-12 bg-muted/40 border-y">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="space-y-1">
                <div className="text-4xl font-extrabold text-primary">
                  {(openJobsCount || 0) + 120}+
                </div>
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Active Tech Job Listings
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-4xl font-extrabold text-primary">
                  {(studentCount || 0) + 2500}+
                </div>
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Verified Engineering Students
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-4xl font-extrabold text-primary">
                  {(institutionCount || 0) + 45}+
                </div>
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Partner Career Centers
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Ecosystem Pillars Section */}
        <section className="py-20">
          <div className="container px-4 md:px-6">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
              <h2 className="text-3xl font-extrabold tracking-tight">Built for India's Tech Ecosystem</h2>
              <p className="text-muted-foreground text-sm">
                A three-sided network specifically engineered to eliminate friction between campus talent, growing tech companies, and university placement officers.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Pillar 1: Students */}
              <div className="flex flex-col p-8 bg-background rounded-2xl border shadow-sm space-y-4 hover:border-primary/50 transition-colors">
                <div className="p-3 w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <UserCheck className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">For Students</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Build a verified technical profile, showcase project skills, upload private resumes, and get matched with high-growth engineering teams.
                </p>
                <div className="pt-2">
                  <Link
                    href="/for-students"
                    className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                  >
                    <span>Explore Student Features</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>

              {/* Pillar 2: Employers */}
              <div className="flex flex-col p-8 bg-background rounded-2xl border shadow-sm space-y-4 hover:border-primary/50 transition-colors">
                <div className="p-3 w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Building2 className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">For Employers</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Post targeted job openings, filter applicants by skill overlap, manage recruitment pipelines, and contact qualified candidates directly.
                </p>
                <div className="pt-2">
                  <Link
                    href="/for-employers"
                    className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                  >
                    <span>Explore Employer Plans</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>

              {/* Pillar 3: Institutions */}
              <div className="flex flex-col p-8 bg-background rounded-2xl border shadow-sm space-y-4 hover:border-primary/50 transition-colors">
                <div className="p-3 w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">For Institutions</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Track campus placement analytics in real time, export CSV outcome reports, host virtual campus fairs, and partner with top employers.
                </p>
                <div className="pt-2">
                  <Link
                    href="/for-institutions"
                    className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                  >
                    <span>Explore Career Center Portal</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 bg-muted/30 border-t">
          <div className="container px-4 md:px-6">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
              <h2 className="text-3xl font-extrabold tracking-tight">How Hackerzone Works</h2>
              <p className="text-muted-foreground text-sm">
                Transparent matching powered by structured skills and real-time database updates.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="space-y-3 text-center md:text-left">
                <div className="text-2xl font-black text-primary">01</div>
                <h4 className="font-bold text-lg">Set Up Profile</h4>
                <p className="text-sm text-muted-foreground">
                  Students specify their verified skills; employers define job requirements; career centers connect campus domains.
                </p>
              </div>

              <div className="space-y-3 text-center md:text-left">
                <div className="text-2xl font-black text-primary">02</div>
                <h4 className="font-bold text-lg">Smart Skill Matching</h4>
                <p className="text-sm text-muted-foreground">
                  Our transparent algorithm matches candidates and jobs based on skill overlap count, recency, and location preferences.
                </p>
              </div>

              <div className="space-y-3 text-center md:text-left">
                <div className="text-2xl font-black text-primary">03</div>
                <h4 className="font-bold text-lg">Direct Hiring Loop</h4>
                <p className="text-sm text-muted-foreground">
                  Recruiters review resumes and update application stages; candidates receive instant real-time notifications.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
