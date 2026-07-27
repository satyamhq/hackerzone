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
        {/* HERO SECTION */}
        <section className="relative py-20 lg:py-28 bg-radial-glow overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
            <Badge variant="brand" className="px-4 py-1.5 shadow-sm">
              <GraduationCap className="h-4 w-4 text-blue-600 mr-1.5" />
              <span>University Career Center Portal</span>
            </Badge>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight">
              Streamline Campus Placement <span className="text-gradient">Operations</span>
            </h1>

            <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Empower university placement officers with real-time student application tracking, campus event management, and instant CSV outcome reporting.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/sign-up">
                <Button variant="brand" size="lg" className="gap-2 shadow-xl shadow-blue-500/20">
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
            <Card hover className="p-8 space-y-6">
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

            <Card hover className="p-8 space-y-6">
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

            <Card hover className="p-8 space-y-6">
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
          <div className="rounded-3xl bg-slate-900 text-white p-10 md:p-16 text-center space-y-6 shadow-2xl relative overflow-hidden">
            <div className="max-w-xl mx-auto space-y-3">
              <h2 className="text-3xl font-extrabold tracking-tight">Claim Your Campus Profile</h2>
              <p className="text-sm text-slate-400">
                Join leading Indian universities in modernizing placement cell workflows and connecting students with top engineering companies.
              </p>
            </div>
            <Link href="/sign-up">
              <Button variant="brand" size="lg" className="gap-2 shadow-xl">
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
