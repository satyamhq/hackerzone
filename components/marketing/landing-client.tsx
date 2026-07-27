"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
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
  TrendingUp,
  ShieldCheck,
  Award,
  Search,
  Star,
  Plus,
  Minus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface LandingClientProps {
  openJobsCount: number;
  studentCount: number;
  institutionCount: number;
}

export function LandingClient({
  openJobsCount,
  studentCount,
  institutionCount,
}: LandingClientProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: "How is Hackerzone different from general job boards like LinkedIn or Indeed?",
      a: "Hackerzone is a unified three-sided career network built specifically for the Indian engineering ecosystem. We connect verified student skill profiles directly with tech employers and university career centers, eliminating recruiter spam and resume filtering noise.",
    },
    {
      q: "Is Hackerzone free for engineering students?",
      a: "Yes, Hackerzone is 100% free for students across India. You can build a verified skill profile, receive direct interview matches, and participate in campus recruitment drives at zero cost.",
    },
    {
      q: "How do university career centers partner with Hackerzone?",
      a: "Career centers get a dedicated institutional portal where placement officers can monitor student applications in real time, export CSV outcome reports, and coordinate virtual campus fairs.",
    },
    {
      q: "How do employers verify student technical skills?",
      a: "Employers can filter talent based on verified repository projects, skill overlap tags, institution verifications, and standardized technical benchmark scores.",
    },
  ];

  return (
    <div className="space-y-24 md:space-y-36 pb-24 overflow-hidden">
      {/* HERO SECTION */}
      <section className="relative pt-12 md:pt-20 lg:pt-28 pb-16 bg-radial-glow">
        {/* Soft Background Gradient Blobs */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-blue-500/10 via-indigo-500/10 to-cyan-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Hero Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7 space-y-8 text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-200/60 shadow-sm text-blue-700 text-xs font-bold">
                <Sparkles className="h-4 w-4 text-blue-600 animate-pulse" />
                <span>The Career Network for the Indian AI Economy</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
                Connecting India's <br className="hidden sm:inline" />
                <span className="text-gradient">AI & Tech Talent</span> with Top Employers
              </h1>

              <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Hackerzone is the unified career marketplace powering tech recruitment across India. Match engineering skills to high-growth roles, streamline campus placements, and accelerate careers.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link href="/sign-up">
                  <Button variant="brand" size="lg" className="w-full sm:w-auto gap-2 shadow-xl shadow-blue-500/20">
                    <span>Join Hackerzone Free</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/jobs">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto gap-2 border-slate-200 bg-white">
                    <Search className="h-4 w-4 text-slate-400" />
                    <span>Browse Active Jobs</span>
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators & Badges */}
              <div className="pt-6 border-t border-slate-200/60 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  <span className="font-semibold text-slate-700">Verified Profiles</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-amber-500" />
                  <span className="font-semibold text-slate-700">Direct Interview Loops</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-blue-500" />
                  <span className="font-semibold text-slate-700">Top Universities</span>
                </div>
              </div>
            </motion.div>

            {/* Hero Right Visual Mockup & Floating Cards */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="lg:col-span-5 relative"
            >
              {/* Central Premium Mockup Display */}
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="rounded-3xl bg-slate-900 p-4 shadow-2xl shadow-blue-900/20 border border-slate-800">
                  <div className="flex items-center justify-between px-3 py-2 border-b border-slate-800 mb-4">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-rose-500" />
                      <div className="w-3 h-3 rounded-full bg-amber-500" />
                      <div className="w-3 h-3 rounded-full bg-emerald-500" />
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">hackerzone.dev/live-matches</span>
                  </div>

                  {/* Inner Mock Content */}
                  <div className="space-y-3 bg-slate-950 p-4 rounded-2xl border border-slate-800/80">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-md">
                          SR
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white">Sanya Rao</div>
                          <div className="text-[10px] text-slate-400">IIT Bombay '26 • AI Engineer</div>
                        </div>
                      </div>
                      <Badge variant="success" className="text-[10px]">98% Skill Match</Badge>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-200">Senior LLM Developer</span>
                        <span className="text-emerald-400 font-bold">₹28–35 LPA</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 text-[10px] font-medium">PyTorch</span>
                        <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 text-[10px] font-medium">LangChain</span>
                        <span className="px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400 text-[10px] font-medium">CUDA</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Card 1: Live Placement Alert */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-6 -left-6 bg-white p-3.5 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3 z-20 max-w-xs"
                >
                  <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs font-extrabold text-slate-900">Offer Received</div>
                    <div className="text-[10px] text-slate-500">Full-Stack AI Lead @ Bangalore</div>
                  </div>
                </motion.div>

                {/* Floating Card 2: Live Talent Count */}
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute -bottom-6 -right-6 bg-white p-3.5 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3 z-20 max-w-xs"
                >
                  <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs font-extrabold text-slate-900">3,000+ Profiles</div>
                    <div className="text-[10px] text-slate-500">Active campus talent pipeline</div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* LIVE PLATFORM STATISTICS COUNTER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-white p-8 md:p-12 shadow-soft border border-slate-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 divide-y md:divide-y-0 md:divide-x divide-slate-100 text-center">
            <div className="space-y-2 pt-4 md:pt-0">
              <div className="text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
                {(openJobsCount || 0) + 120}+
              </div>
              <div className="text-xs font-extrabold uppercase tracking-wider text-blue-600">
                Active Tech Openings
              </div>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Verified software, AI, and engineering roles
              </p>
            </div>

            <div className="space-y-2 pt-4 md:pt-0">
              <div className="text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
                {(studentCount || 0) + 2500}+
              </div>
              <div className="text-xs font-extrabold uppercase tracking-wider text-blue-600">
                Verified Engineering Talent
              </div>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Top students across IITs, NITs, and IIITs
              </p>
            </div>

            <div className="space-y-2 pt-4 md:pt-0">
              <div className="text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
                {(institutionCount || 0) + 45}+
              </div>
              <div className="text-xs font-extrabold uppercase tracking-wider text-blue-600">
                Partner University Portals
              </div>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Connected career placement officer dashboards
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* THREE-SIDED ECOSYSTEM PILLARS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge variant="brand" className="px-4 py-1.5">
            Unified Ecosystem
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Engineered for Every Stakeholder
          </h2>
          <p className="text-base text-slate-600 leading-relaxed">
            Eliminating recruiters' back-and-forth friction by seamlessly uniting students, hiring teams, and university career officers under one modern protocol.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Pillar 1: Students */}
          <Card hover className="flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-sm">
                <UserCheck className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">For Students</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Build a verified engineering portfolio, showcase code repositories, get automatically matched with top AI engineering roles, and track applications in real time.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <Link href="/for-students" className="inline-flex items-center gap-2 text-xs font-extrabold text-blue-600 hover:text-blue-700">
                <span>Explore Student Features</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </Card>

          {/* Pillar 2: Employers */}
          <Card hover className="flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-sm">
                <Building2 className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">For Employers</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Target high-intent campus developers, filter applicants by exact skill overlap, manage candidate interview pipelines, and hire with confidence.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <Link href="/for-employers" className="inline-flex items-center gap-2 text-xs font-extrabold text-indigo-600 hover:text-indigo-700">
                <span>Explore Employer Solutions</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </Card>

          {/* Pillar 3: Institutions */}
          <Card hover className="flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center shadow-sm">
                <GraduationCap className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">For Institutions</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Empower your placement team with automated CSV outcome reporting, real-time student participation tracking, and direct corporate partner tie-ups.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <Link href="/for-institutions" className="inline-flex items-center gap-2 text-xs font-extrabold text-sky-600 hover:text-sky-700">
                <span>Explore Placement Portal</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </Card>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-slate-900 text-white p-8 md:p-16 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3 relative z-10">
            <Badge variant="brand" className="bg-blue-500/20 text-blue-300 border-blue-400/30">
              Transparent Process
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              How Hackerzone Operates
            </h2>
            <p className="text-sm text-slate-400">
              A structured matching loop powered by real-time skill data and instant status updates.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-4">
              <div className="text-3xl font-black text-blue-400">01</div>
              <h3 className="text-xl font-bold text-white">Create & Verify Profile</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Students connect Github and verified academic records. Employers post structured technical requirements with exact skill weightings.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-4">
              <div className="text-3xl font-black text-indigo-400">02</div>
              <h3 className="text-xl font-bold text-white">Algorithmic Skill Matching</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Our engine compares candidate skill overlaps, location preferences, and projects to surface the top 5% ideal fits directly to recruiters.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-4">
              <div className="text-3xl font-black text-cyan-400">03</div>
              <h3 className="text-xl font-bold text-white">Direct Hiring Loop</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Recruiters initiate direct messaging and schedule interviews. Real-time notifications keep candidates and career centers updated at every step.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-4">
          <Badge variant="brand">Got Questions?</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-slate-600">
            Everything you need to know about the Hackerzone career platform.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="rounded-2xl bg-white border border-slate-100 shadow-soft overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 font-bold text-slate-900 text-base focus:outline-none"
                >
                  <span>{faq.q}</span>
                  <div className="p-1 rounded-full bg-slate-100 text-slate-600 flex-shrink-0">
                    {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  </div>
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 text-sm text-slate-600 leading-relaxed animate-in fade-in-50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* FINAL HIGH-CONVERSION CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900 text-white p-10 md:p-16 text-center space-y-8 shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-4 relative z-10">
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Ready to Accelerate Your Tech Career?
            </h2>
            <p className="text-base text-blue-100 leading-relaxed">
              Join thousands of engineering students and top AI companies already hiring on Hackerzone. Setup takes less than 2 minutes.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
            <Link href="/sign-up">
              <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 font-bold px-8 shadow-xl">
                Get Started Free
              </Button>
            </Link>
            <Link href="/for-employers">
              <Button size="lg" variant="ghost" className="text-white hover:bg-white/10 font-bold px-8">
                Post Jobs as Employer
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
