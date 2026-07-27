import Link from "next/link";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { ArrowRight, BarChart3, Calendar, Download, GraduationCap, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ForInstitutionsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#FAFBFC]">
      <Navbar />

      <main className="flex-1">
        {/* HANDSHAKE DARK HERO SECTION */}
        <section className="relative py-20 lg:py-28 handshake-hero-mesh text-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/15 backdrop-blur-md text-xs font-extrabold uppercase tracking-widest text-[#7AF3FF]">
              <GraduationCap className="h-4 w-4 text-[#7AF3FF]" />
              <span>EMPOWER YOUR CAREER CENTER</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto uppercase leading-tight text-white">
              STREAMLINE CAMPUS PLACEMENT <span className="text-gradient-lime">OPERATIONS</span>
            </h1>

            <p className="text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto font-medium">
              Empower university placement officers with real-time student application tracking, campus event management, and instant CSV outcome reporting.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/sign-up">
                <Button variant="lime" size="lg" className="gap-2 shadow-xl text-[#052326] font-extrabold">
                  <span>Register Your Institution</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* 3-PILLAR FEATURE GRID */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-24">
          <div className="grid md:grid-cols-3 gap-8">
            <Card hover className="p-8 space-y-6 border-slate-200/80">
              <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-sm">
                <BarChart3 className="h-6 w-6" />
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-slate-900">Real Placement Metrics</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Track total student applications, shortlisted counts, and verified job offer letters grouped automatically by your university domain.
                </p>
              </div>
              <div className="pt-2">
                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-semibold">Live Analytics Dashboard</span>
              </div>
            </Card>

            <Card hover className="p-8 space-y-6 border-slate-200/80">
              <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-sm">
                <Calendar className="h-6 w-6" />
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-slate-900">Campus Fairs & Workshops</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Schedule virtual or on-campus career fairs and tech speaker sessions that surface directly on your enrolled students' dashboards.
                </p>
              </div>
              <div className="pt-2">
                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-semibold">Event Hosting Engine</span>
              </div>
            </Card>

            <Card hover className="p-8 space-y-6 border-slate-200/80">
              <div className="h-12 w-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center shadow-sm">
                <Download className="h-6 w-6" />
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-slate-900">Instant CSV Export</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Generate server-side CSV placement reports with one click for NAAC accreditation, NIRF data submission, and university leadership.
                </p>
              </div>
              <div className="pt-2">
                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-semibold">Server-Side CSV Stream</span>
              </div>
            </Card>
          </div>
        </section>

        {/* INSTITUTION CTA */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
          <div className="rounded-3xl bg-[#14151C] text-white p-10 md:p-16 text-center space-y-6 shadow-2xl relative overflow-hidden">
            <div className="max-w-xl mx-auto space-y-3">
              <h2 className="text-3xl font-extrabold tracking-tight">Claim Your Campus Profile</h2>
              <p className="text-sm text-slate-300">
                Join leading Indian universities in modernizing placement cell workflows and connecting students with top engineering companies.
              </p>
            </div>
            <Link href="/sign-up">
              <Button variant="lime" size="lg" className="gap-2 shadow-xl text-[#052326] font-extrabold">
                <span>Register Institution Free</span>
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
