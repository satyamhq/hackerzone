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
  ArrowUpRight,
  Code2,
  Cpu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const sampleSearchPrompts = [
    "AI Evaluation Specialist using Python",
    "Full-Stack Developer in Bengaluru",
    "Remote LLM Fine-Tuning Engineer",
    "Campus Internships at IIT Bombay",
  ];

  const [promptIndex, setPromptIndex] = useState(0);

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/jobs?query=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/jobs");
    }
  }

  const faqs = [
    {
      q: "How is Hackerzone different from general job boards like LinkedIn or Indeed?",
      a: "Hackerzone is a unified three-sided career network built specifically for the AI economy in India. We connect verified student skill profiles directly with tech employers and university career centers, eliminating recruiter spam and resume filtering noise.",
    },
    {
      q: "Is Hackerzone free for engineering students and job seekers?",
      a: "Yes, Hackerzone is 100% free for students and developers across India. You can build a verified skill profile, receive direct interview matches, and participate in campus recruitment drives at zero cost.",
    },
    {
      q: "How do university career centers partner with Hackerzone?",
      a: "Career centers get a dedicated institutional portal where placement officers can monitor student applications in real time, export CSV outcome reports, and coordinate virtual campus placement drives.",
    },
    {
      q: "How do employers verify developer technical skills?",
      a: "Employers can filter talent based on verified repository projects, skill overlap tags, institution verifications, and standardized technical benchmark scores.",
    },
  ];

  const featuredOpportunities = [
    {
      title: "AI Evaluation Specialist",
      compensation: "Up to ₹25–35 LPA / $45/hr",
      requirement: "Bachelor's · Master's · Python & RLHF",
      link: "/jobs",
      badge: "High Demand",
    },
    {
      title: "Full-Stack AI Engineer",
      compensation: "Up to ₹20–30 LPA",
      requirement: "Next.js · TypeScript · LangChain",
      link: "/jobs",
      badge: "Remote Eligible",
    },
    {
      title: "LLM Data & Alignment Developer",
      compensation: "Up to ₹35–50 LPA / $60/hr",
      requirement: "PyTorch · CUDA · Model Fine-tuning",
      link: "/jobs",
      badge: "Urgent Hiring",
    },
    {
      title: "Campus AI & Software Intern",
      compensation: "₹40,000 – ₹70,000 / month",
      requirement: "Undergraduate Engineering Students",
      link: "/jobs",
      badge: "Campus Placement",
    },
    {
      title: "Computer Vision & Edge AI Lead",
      compensation: "Up to ₹30–42 LPA",
      requirement: "OpenCV · TensorRT · C++",
      link: "/jobs",
      badge: "Full-time",
    },
    {
      title: "FinTech Data Systems Engineer",
      compensation: "Up to ₹22–32 LPA",
      requirement: "Postgres · Kafka · Go",
      link: "/jobs",
      badge: "Bangalore / Hybrid",
    },
  ];

  return (
    <div className="space-y-24 md:space-y-36 pb-24 overflow-hidden bg-[#FAFBFC]">
      {/* HANDSHAKE-STYLE DARK HERO SECTION WITH CYAN/LIME GLOW MESH */}
      <section className="relative pt-16 pb-24 md:pt-28 md:pb-36 handshake-hero-mesh text-white overflow-hidden">
        {/* Glow Circles */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#7AF3FF]/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-[#D3FB52]/15 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Top Pill Header */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/15 backdrop-blur-md text-xs font-extrabold uppercase tracking-widest text-[#D3FB52]"
            >
              <Sparkles className="h-4 w-4 text-[#D3FB52]" />
              <span>THE CAREER NETWORK FOR THE INDIAN AI ECONOMY</span>
            </motion.div>

            {/* Main Big Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight uppercase leading-[0.95] text-white"
            >
              LET'S FIND YOUR <br />
              <span className="text-gradient-lime">NEXT TECH JOB</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed"
            >
              10,000+ top engineering employers. Verified AI, full-stack, and campus developer roles across all levels.
            </motion.p>

            {/* Handshake-Style Interactive Search Bar */}
            <motion.form
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              onSubmit={handleSearchSubmit}
              className="relative max-w-3xl mx-auto pt-4"
            >
              <div className="relative flex items-center bg-white rounded-3xl p-2.5 shadow-2xl shadow-black/50 border border-white/20">
                <Search className="h-6 w-6 text-slate-400 ml-4 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Search: "${sampleSearchPrompts[promptIndex]}"`}
                  className="w-full h-14 pl-4 pr-32 text-slate-900 placeholder:text-slate-400 text-base sm:text-lg font-semibold bg-transparent focus:outline-none"
                />
                <Button
                  type="submit"
                  variant="lime"
                  size="lg"
                  className="absolute right-3.5 h-12 px-6 rounded-2xl gap-2 font-extrabold text-sm text-[#052326]"
                >
                  <span>Search Jobs</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </motion.form>

            {/* Quick Filter Tag Chips */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs font-semibold"
            >
              <span className="text-slate-400 text-xs font-bold uppercase tracking-wider mr-2">Popular:</span>
              <button
                onClick={() => router.push("/jobs?query=AI+Specialists")}
                className="px-4 py-2 rounded-full border border-white/15 bg-white/5 hover:bg-white/15 transition-colors text-white"
              >
                AI Specialists
              </button>
              <button
                onClick={() => router.push("/jobs?job_type=full_time")}
                className="px-4 py-2 rounded-full border border-white/15 bg-white/5 hover:bg-white/15 transition-colors text-white"
              >
                Full-time
              </button>
              <button
                onClick={() => router.push("/jobs?is_remote=true")}
                className="px-4 py-2 rounded-full border border-white/15 bg-white/5 hover:bg-white/15 transition-colors text-white"
              >
                Remote
              </button>
              <button
                onClick={() => router.push("/jobs?job_type=internship")}
                className="px-4 py-2 rounded-full border border-white/15 bg-white/5 hover:bg-white/15 transition-colors text-white"
              >
                Internship
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FEATURED OPPORTUNITIES ("Get paid to make AI smarter and safer") */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200/80 pb-6">
            <div>
              <Badge variant="brand" className="mb-2">
                High Salary Roles
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Get paid to build and scale AI
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                No matter your background, shape the future of tech with 100K+ engineers across India.
              </p>
            </div>
            <Link href="/jobs">
              <Button variant="outline" className="gap-2 border-slate-300">
                <span>View All Openings</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredOpportunities.map((opp, idx) => (
              <Card
                key={idx}
                hover
                className="p-6 flex flex-col justify-between space-y-6 border-slate-200/80 hover:border-blue-500/40"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="brand" className="text-[10px]">
                      {opp.badge}
                    </Badge>
                    <ArrowUpRight className="h-4 w-4 text-slate-400" />
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900 leading-snug">
                    {opp.title}
                  </h3>
                  <div className="text-lg font-bold text-emerald-600">
                    {opp.compensation}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>{opp.requirement}</span>
                  <Link href="/jobs" className="font-extrabold text-blue-600 hover:underline">
                    Apply →
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* LIVE PLATFORM STATISTICS COUNTER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-slate-900 text-white p-8 md:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#7AF3FF]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 divide-y md:divide-y-0 md:divide-x divide-slate-800 text-center relative z-10">
            <div className="space-y-2 pt-4 md:pt-0">
              <div className="text-4xl lg:text-5xl font-extrabold text-[#D3FB52] tracking-tight">
                {(openJobsCount || 0) + 120}+
              </div>
              <div className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
                Active Tech Job Listings
              </div>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Verified software, AI, and engineering roles
              </p>
            </div>

            <div className="space-y-2 pt-4 md:pt-0">
              <div className="text-4xl lg:text-5xl font-extrabold text-[#7AF3FF] tracking-tight">
                {(studentCount || 0) + 2500}+
              </div>
              <div className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
                Verified Engineering Talent
              </div>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Top students across IITs, NITs, and IIITs
              </p>
            </div>

            <div className="space-y-2 pt-4 md:pt-0">
              <div className="text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                {(institutionCount || 0) + 45}+
              </div>
              <div className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
                Partner University Portals
              </div>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
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
            Handshake-Grade Architecture
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Engineered for Every Stakeholder
          </h2>
          <p className="text-base text-slate-600 leading-relaxed">
            Eliminating back-and-forth recruiter friction by seamlessly uniting students, hiring teams, and university career officers under one protocol.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Pillar 1: Students */}
          <Card hover className="flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-sm">
                <UserCheck className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">For Students & Job Seekers</h3>
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
              <h3 className="text-2xl font-bold text-slate-900">For Career Centers</h3>
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
        <div className="rounded-3xl bg-[#14151C] text-white p-8 md:p-16 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#7AF3FF]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3 relative z-10">
            <Badge variant="brand" className="bg-[#D3FB52]/10 text-[#D3FB52] border-[#D3FB52]/20">
              Transparent Matching Loop
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              How Hackerzone Operates
            </h2>
            <p className="text-sm text-slate-400">
              A structured matching loop powered by real-time skill data and instant status updates.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <div className="text-3xl font-black text-[#D3FB52]">01</div>
              <h3 className="text-xl font-bold text-white">Create & Verify Profile</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Students connect Github and verified academic records. Employers post structured technical requirements with exact skill weightings.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <div className="text-3xl font-black text-[#7AF3FF]">02</div>
              <h3 className="text-xl font-bold text-white">Algorithmic Skill Matching</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Our engine compares candidate skill overlaps, location preferences, and projects to surface the top 5% ideal fits directly to recruiters.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
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
                className="rounded-2xl bg-white border border-slate-200/80 shadow-soft overflow-hidden transition-all duration-200"
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
        <div className="rounded-3xl bg-[#14151C] text-white p-10 md:p-16 text-center space-y-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-tr from-[#7AF3FF]/10 via-[#D3FB52]/10 to-transparent pointer-events-none" />

          <div className="max-w-2xl mx-auto space-y-4 relative z-10">
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Ready to Accelerate Your Tech Career?
            </h2>
            <p className="text-base text-slate-300 leading-relaxed">
              Join thousands of engineering students and top AI companies already hiring on Hackerzone. Setup takes less than 2 minutes.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
            <Link href="/sign-up">
              <Button size="lg" variant="lime" className="font-extrabold px-8 text-[#052326] shadow-xl">
                Get Started Free
              </Button>
            </Link>
            <Link href="/for-employers">
              <Button size="lg" variant="dark" className="font-bold px-8">
                Post Jobs as Employer
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
