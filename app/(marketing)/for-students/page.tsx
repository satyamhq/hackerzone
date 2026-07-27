import Link from "next/link";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import {
  ArrowRight,
  CheckCircle2,
  FileText,
  Sparkles,
  UserCheck,
  Zap,
  ShieldCheck,
  Briefcase,
  Code2,
  Rocket,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ForStudentsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#FAFBFC]">
      <Navbar />

      <main className="flex-1">
        {/* HANDSHAKE DARK HERO SECTION */}
        <section className="relative py-20 lg:py-28 handshake-hero-mesh text-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/15 backdrop-blur-md text-xs font-extrabold uppercase tracking-widest text-[#D3FB52]">
              <UserCheck className="h-4 w-4 text-[#D3FB52]" />
              <span>WHERE YOUR CAREER BEGINS</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto uppercase leading-tight text-white">
              LAUNCH YOUR ENGINEERING CAREER ON <span className="text-gradient-lime">HACKERZONE</span>
            </h1>

            <p className="text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto font-medium">
              Build your verified technical profile, get dynamically matched with top AI & software engineering roles, and track applications in real time.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/sign-up">
                <Button variant="lime" size="lg" className="gap-2 shadow-xl text-[#052326] font-extrabold">
                  <span>Create Free Student Account</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/jobs">
                <Button variant="dark" size="lg">
                  Explore Active Openings
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* FEATURE GRID */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
          <div className="grid md:grid-cols-2 gap-8">
            <Card hover className="p-8 space-y-6 border-slate-200/80">
              <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-sm">
                <Sparkles className="h-6 w-6" />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-slate-900">Skill-Based Overlap Matching</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  No black-box filters. Open roles are scored dynamically based on your verified tech skills (React, TypeScript, Python, Next.js, PyTorch), project recency, and location preferences.
                </p>
              </div>
              <div className="pt-2 flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">Skill Overlap Matrix</span>
                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">Instant Score</span>
              </div>
            </Card>

            <Card hover className="p-8 space-y-6 border-slate-200/80">
              <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-sm">
                <FileText className="h-6 w-6" />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-slate-900">Private Storage & Signed Resumes</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Your resume PDF is stored securely in an encrypted private bucket. Only verified recruiters who receive your explicit application can access signed download URLs.
                </p>
              </div>
              <div className="pt-2 flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">AES-256 Storage</span>
                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">Signed Access</span>
              </div>
            </Card>

            <Card hover className="p-8 space-y-6 border-slate-200/80">
              <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-sm">
                <Zap className="h-6 w-6" />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-slate-900">Real-Time Application Timeline</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Never wonder about your application status. Get real-time status updates when recruiters review your resume, shortlist your profile, or send interview invites.
                </p>
              </div>
              <div className="pt-2 flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">Push Alerts</span>
                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">Live Stage Tracking</span>
              </div>
            </Card>

            <Card hover className="p-8 space-y-6 border-slate-200/80">
              <div className="h-12 w-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-sm">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-slate-900">Direct Campus Placement Sync</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Connect your university domain email to seamlessly participate in exclusive campus placement drives and institutional partner interviews.
                </p>
              </div>
              <div className="pt-2 flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">Campus Verification</span>
                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">Priority Drives</span>
              </div>
            </Card>
          </div>
        </section>

        {/* CTA BANNER */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
          <div className="rounded-3xl bg-[#14151C] text-white p-10 md:p-16 text-center space-y-6 shadow-2xl relative overflow-hidden">
            <div className="max-w-xl mx-auto space-y-3">
              <h2 className="text-3xl font-extrabold tracking-tight">Ready to Kickstart Your Tech Journey?</h2>
              <p className="text-sm text-slate-300">
                Create your student profile in less than 2 minutes and start matching with open developer positions across India.
              </p>
            </div>
            <Link href="/sign-up">
              <Button variant="lime" size="lg" className="gap-2 shadow-xl text-[#052326] font-extrabold">
                <span>Create Free Student Account</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
