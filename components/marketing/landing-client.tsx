"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  ArrowRight,
  ShieldCheck,
  Brain,
  Cpu,
  CheckCircle2,
  Lock,
  Sparkles,
  Bot,
  Zap,
  Globe2,
  Terminal,
  Activity,
  Layers,
  ArrowUpRight,
  Scale,
  Stethoscope,
  BarChart3,
  Code2,
  Award,
  ChevronRight,
  Filter,
  Eye,
  SlidersHorizontal,
  Compass,
} from "lucide-react";
import { motion } from "framer-motion";

// Sample verified experts for live discovery preview
const SAMPLE_EXPERTS = [
  {
    id: "exp-1",
    name: "Dr. Ananya Rao",
    role: "Frontier AI & RLHF Researcher",
    institution: "PhD, Indian Institute of Science",
    location: "Bengaluru, India",
    hzScore: 98.4,
    components: { expertise: 99, taskQuality: 98, reliability: 98, recency: 99 },
    domains: ["Model Evaluation", "RLHF Reasoning", "Safety Testing"],
    stats: { projects: 42, accuracy: "99.2%" },
    verified: ["Identity Verified", "PhD Credential", "Top Performer"],
  },
  {
    id: "exp-2",
    name: "Vikram Malhotra",
    role: "Staff Distributed Systems Engineer",
    institution: "Ex-Google, IIT Bombay",
    location: "Hyderabad, India",
    hzScore: 97.2,
    components: { expertise: 98, taskQuality: 96, reliability: 97, recency: 98 },
    domains: ["Autonomous Agent Benchmarks", "Rust / Go", "Concurrency"],
    stats: { projects: 68, accuracy: "98.5%" },
    verified: ["Identity Verified", "Technical Assessed", "Top Performer"],
  },
  {
    id: "exp-3",
    name: "Adv. Sneha Iyer",
    role: "Regulatory & AI Governance Specialist",
    institution: "LLM, National Law School",
    location: "New Delhi, India",
    hzScore: 96.8,
    components: { expertise: 97, taskQuality: 97, reliability: 96, recency: 97 },
    domains: ["Legal Document Reasoning", "Regulatory Red Teaming", "Contract Logic"],
    stats: { projects: 31, accuracy: "99.0%" },
    verified: ["Identity Verified", "Bar Certified", "Hackerzone Assessed"],
  },
  {
    id: "exp-4",
    name: "Dr. Rohan Sengupta",
    role: "Cardiologist & Clinical AI Evaluator",
    institution: "MD, AIIMS New Delhi",
    location: "Mumbai, India",
    hzScore: 99.1,
    components: { expertise: 100, taskQuality: 99, reliability: 98, recency: 99 },
    domains: ["Clinical Decision Trees", "Medical Diagnostic Reasoning", "Bioethics"],
    stats: { projects: 54, accuracy: "99.8%" },
    verified: ["Identity Verified", "Medical License", "Top Performer"],
  },
];

// Specialist Disciplines & AI Touchpoint matrix per §10
const SPECIALISTS = [
  { label: "Engineers", color: "from-blue-500/20 to-cyan-500/20", icon: Code2 },
  { label: "Scientists", color: "from-purple-500/20 to-pink-500/20", icon: Brain },
  { label: "Researchers", color: "from-emerald-500/20 to-teal-500/20", icon: Compass },
  { label: "Doctors", color: "from-rose-500/20 to-red-500/20", icon: Stethoscope },
  { label: "Lawyers", color: "from-amber-500/20 to-yellow-500/20", icon: Scale },
  { label: "Designers", color: "from-violet-500/20 to-indigo-500/20", icon: Layers },
  { label: "Finance Experts", color: "from-green-500/20 to-emerald-500/20", icon: BarChart3 },
  { label: "Linguists", color: "from-orange-500/20 to-amber-500/20", icon: Globe2 },
  { label: "Cybersecurity", color: "from-red-500/20 to-orange-500/20", icon: ShieldCheck },
  { label: "Domain Specialists", color: "from-zinc-500/20 to-slate-500/20", icon: Award },
];

const AI_WORKLOADS = [
  { label: "AI Training", desc: "Expert reasoning & chain-of-thought human datasets" },
  { label: "Model Evaluation", desc: "Gold-standard benchmarking against human judgment" },
  { label: "AI Agents", desc: "Multi-step tool execution & autonomy evaluation" },
  { label: "Research", desc: "Empirical study participation and domain discovery" },
  { label: "Safety & Alignment", desc: "Policy compliance, bias detection, and ethics" },
  { label: "Red Teaming", desc: "Adversarial stress-testing, jailbreaks & vulnerability discovery" },
];

// 22 Categories per §12
const EXPERTISE_CATEGORIES = [
  { name: "Software Engineering", count: "3,400+", skills: ["Distributed Systems", "Full Stack", "Compilers", "Rust/C++", "Architecture"] },
  { name: "AI / ML & Data Science", count: "2,850+", skills: ["RLHF", "Model Evaluation", "PyTorch", "Prompt Engineering", "Fine-Tuning"] },
  { name: "Mathematics & Logic", count: "1,200+", skills: ["Formal Proofs", "Combinatorics", "Statistics", "Calculus", "Optimization"] },
  { name: "Medicine & Health", count: "890+", skills: ["Clinical Reasoning", "Diagnostics", "Pharmacology", "Radiology", "Genomics"] },
  { name: "Law & Jurisprudence", count: "740+", skills: ["Contract Law", "IP & Patents", "Regulatory Compliance", "Statutory Interpretation"] },
  { name: "Finance & Economics", count: "1,450+", skills: ["Financial Modeling", "Portfolio Theory", "Taxation", "Quantitative Analysis"] },
  { name: "Cybersecurity", count: "1,100+", skills: ["Penetration Testing", "Threat Modeling", "Smart Contract Audits", "Forensics"] },
  { name: "Physics & Chemistry", count: "650+", skills: ["Quantum Computing", "Thermodynamics", "Organic Chemistry", "Materials"] },
  { name: "Languages & Linguistics", count: "1,600+", skills: ["Indic Languages", "NLP Annotation", "Dialects", "Semantic Nuance"] },
  { name: "Design & UX", count: "980+", skills: ["Design Systems", "UI Heuristics", "Information Architecture", "Figma"] },
  { name: "Business & Strategy", count: "1,320+", skills: ["Corporate Finance", "Operations Research", "Market Sizing", "Supply Chain"] },
  { name: "Research & Academia", count: "1,800+", skills: ["Peer Review", "Meta-Analysis", "Empirical Methodology", "Grant Writing"] },
];

export function LandingClient() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialist, setSelectedSpecialist] = useState(0);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState(0);

  const presetQueries = [
    "Senior Python engineer with fintech experience",
    "Medical reasoning evaluation with clinical trials background",
    "Indian lawyers experienced in contract law & statutory interpretation",
    "Physics PhDs for multi-modal model evaluation",
    "Experts in Hindi & Tamil technical and medical terminology",
  ];

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/jobs?query=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/jobs");
    }
  }

  return (
    <div className="relative w-full overflow-hidden bg-[#0A0A0A] text-[#F5F5F5]">
      {/* ─────────────────────────────────────────────────────────────
          1. HERO SECTION (§8, §9)
      ───────────────────────────────────────────────────────────── */}
      <section className="relative pt-20 pb-24 md:pt-28 md:pb-32 px-4 sm:px-6 lg:px-8 border-b border-[#3F3F3F]/40 overflow-hidden">
        {/* Subtle radial glow background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-gradient-to-b from-white/[0.06] via-white/[0.02] to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/15 bg-white/5 text-xs font-mono text-white/90 backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>THE HUMAN INTELLIGENCE NETWORK FOR AI</span>
          </div>

          {/* Master Headline per §8, §9 */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[80px] font-black tracking-tight leading-[1.05] text-white">
            The human intelligence network
            <br />
            <span className="bg-gradient-to-r from-white via-[#E5E5E5] to-[#A3A3A3] bg-clip-text text-transparent">
              powering the AI economy.
            </span>
          </h1>

          {/* Subheading & Core Thesis per §0, §9 */}
          <p className="text-lg sm:text-xl text-[#A3A3A3] max-w-3xl mx-auto font-normal leading-relaxed">
            Discover, verify, and deploy human expertise to train, evaluate, and supervise AI.
            <span className="block mt-2 text-sm sm:text-base text-[#A3A3A3]/80">
              AI systems are becoming abundant. High-quality human expertise is the scarce resource.
            </span>
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/jobs"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white text-black font-bold text-sm hover:bg-[#E5E5E5] transition-all hover:scale-[1.02] shadow-xl shadow-white/5"
            >
              Find Experts
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/sign-up"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-[#3F3F3F] bg-white/5 text-white font-semibold text-sm hover:bg-white/10 hover:border-white/30 transition-all"
            >
              Become an Expert
              <ArrowUpRight className="h-4 w-4 text-[#A3A3A3]" />
            </Link>
          </div>

          {/* Natural Language Search Input Bar (§13) */}
          <div className="max-w-3xl mx-auto pt-6">
            <form
              onSubmit={handleSearchSubmit}
              className="relative flex items-center bg-[#161616] border border-[#3F3F3F] rounded-full p-2 shadow-2xl focus-within:border-white/40 transition-all"
            >
              <Search className="h-5 w-5 text-[#A3A3A3] ml-4 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search verified experts: e.g. Senior Python engineer with fintech experience..."
                className="w-full h-11 pl-3 pr-14 text-sm font-medium bg-transparent text-white placeholder:text-[#A3A3A3] focus:outline-none"
              />
              <button
                type="submit"
                className="h-10 px-5 flex items-center gap-1.5 rounded-full bg-white text-black text-xs font-bold hover:bg-[#E5E5E5] transition-colors shrink-0"
              >
                <span>Search</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </form>

            {/* Prompt presets */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-3">
              <span className="text-[11px] text-[#A3A3A3] mr-1">Popular searches:</span>
              {presetQueries.slice(0, 3).map((query) => (
                <button
                  key={query}
                  onClick={() => setSearchQuery(query)}
                  className="text-[11px] text-[#A3A3A3] bg-white/5 hover:bg-white/10 hover:text-white px-2.5 py-1 rounded-full border border-white/10 transition-colors truncate max-w-[280px]"
                >
                  &quot;{query}&quot;
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          2. TRUST STATEMENT & PILLARS (§9 Section 2)
      ───────────────────────────────────────────────────────────── */}
      <section className="py-8 bg-[#0D0D0D] border-b border-[#3F3F3F]/30 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
            {[
              { title: "Verified Experts", desc: "Identity & credentials vetted", icon: ShieldCheck },
              { title: "Domain Expertise", desc: "22 deep professional fields", icon: Brain },
              { title: "Reputation Engine", desc: "Multi-signal scoring", icon: Award },
              { title: "AI-Assisted Match", desc: "Graph-based routing", icon: Bot },
              { title: "Global Network", desc: "Diverse languages & regions", icon: Globe2 },
              { title: "Enterprise Trust", desc: "RBAC & isolated sandboxes", icon: Lock },
            ].map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div key={pillar.title} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                  <div className="flex items-center justify-center gap-1.5 text-white font-semibold text-xs">
                    <Icon className="h-3.5 w-3.5 text-[#A3A3A3]" />
                    <span>{pillar.title}</span>
                  </div>
                  <div className="text-[11px] text-[#A3A3A3]">{pillar.desc}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. HUMAN INTELLIGENCE NETWORK MATRIX (§10)
      ───────────────────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 border-b border-[#3F3F3F]/40 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/20">
              Network Architecture (§10)
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white">
              Connecting Verified Human Intelligence to AI Workloads
            </h2>
            <p className="text-sm sm:text-base text-[#A3A3A3]">
              Select a domain specialist to visualize how structured human intelligence routes into AI training, model evaluation, and autonomous agent supervision.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Specialist Nodes */}
            <div className="lg:col-span-5 space-y-2.5">
              <div className="text-xs font-bold uppercase tracking-wider text-[#A3A3A3] px-2 mb-3">
                Verified Specialist Disciplines
              </div>
              <div className="grid grid-cols-2 gap-2">
                {SPECIALISTS.map((spec, idx) => {
                  const Icon = spec.icon;
                  const isSelected = selectedSpecialist === idx;
                  return (
                    <button
                      key={spec.label}
                      onClick={() => setSelectedSpecialist(idx)}
                      className={`flex items-center gap-2.5 p-3 rounded-xl text-left text-xs font-semibold transition-all border ${
                        isSelected
                          ? "bg-white text-black border-white shadow-lg shadow-white/10 scale-[1.02]"
                          : "bg-[#161616] text-[#A3A3A3] border-[#3F3F3F]/60 hover:text-white hover:border-white/20"
                      }`}
                    >
                      <Icon className={`h-4 w-4 shrink-0 ${isSelected ? "text-black" : "text-[#A3A3A3]"}`} />
                      <span className="truncate">{spec.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Middle: Dynamic Pipeline Connector */}
            <div className="hidden lg:flex lg:col-span-2 flex-col items-center justify-center space-y-3">
              <div className="h-16 w-px bg-gradient-to-b from-transparent via-white/40 to-transparent" />
              <div className="p-3 rounded-full bg-white/5 border border-white/20 text-white font-mono text-[10px] uppercase text-center">
                <span>Routing</span>
                <ArrowRight className="h-4 w-4 mx-auto mt-1" />
              </div>
              <div className="h-16 w-px bg-gradient-to-b from-transparent via-white/40 to-transparent" />
            </div>

            {/* Right: AI Workloads Output */}
            <div className="lg:col-span-5 space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-[#A3A3A3] px-2 mb-3 flex items-center justify-between">
                <span>Target AI Infrastructure Workloads</span>
                <span className="font-mono text-emerald-400 text-[11px]">
                  Active: {SPECIALISTS[selectedSpecialist].label}
                </span>
              </div>
              <div className="space-y-2.5">
                {AI_WORKLOADS.map((workload, i) => (
                  <div
                    key={workload.label}
                    className="p-3.5 rounded-xl bg-[#141414] border border-[#3F3F3F]/60 hover:border-white/25 transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-bold text-sm text-white">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        {workload.label}
                      </div>
                      <span className="text-[11px] font-mono text-[#A3A3A3] group-hover:text-white transition-colors">
                        Verified Match
                      </span>
                    </div>
                    <p className="text-xs text-[#A3A3A3] mt-1 pl-3.5">
                      {workload.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. HOW IT WORKS — 5-STAGE INFRASTRUCTURE PIPELINE (§9)
      ───────────────────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 border-b border-[#3F3F3F]/40 bg-[#0E0E0E]">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <span className="text-xs font-mono uppercase tracking-widest text-[#A3A3A3] bg-white/5 px-3 py-1 rounded-full border border-white/10">
              Infrastructure Pipeline (§9 Section 3)
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white">
              How Human Intelligence is Deployed
            </h2>
            <p className="text-sm sm:text-base text-[#A3A3A3]">
              From identity verification to model improvements: a rigorous 5-stage lifecycle.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {[
              {
                step: "01",
                title: "Discover",
                body: "Find people with the exact expertise, language, and credentials your AI system needs.",
                highlight: "Search 22+ domains",
              },
              {
                step: "02",
                title: "Verify",
                body: "Multi-factor vetting across identity, education, professional employment, and task performance.",
                highlight: "Zero self-reported claims",
              },
              {
                step: "03",
                title: "Match",
                body: "Our algorithmic matching engine connects project requirements with verified humans.",
                highlight: "Explainable match score",
              },
              {
                step: "04",
                title: "Execute",
                body: "Experts perform high-value intelligence work inside distraction-free, isolated sandboxes.",
                highlight: "Structured evaluation",
              },
              {
                step: "05",
                title: "Improve",
                body: "Structured human intelligence improves model accuracy, safety, and real-world reasoning.",
                highlight: "Verifiable model uplift",
              },
            ].map((st) => (
              <div
                key={st.step}
                className="relative p-6 rounded-2xl bg-[#161616] border border-[#3F3F3F]/70 flex flex-col justify-between space-y-4 hover:border-white/30 transition-all group"
              >
                <div className="space-y-3">
                  <div className="text-2xl font-black font-mono text-white/30 group-hover:text-white transition-colors">
                    {st.step}
                  </div>
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    {st.title}
                  </h3>
                  <p className="text-xs text-[#A3A3A3] leading-relaxed">
                    {st.body}
                  </p>
                </div>
                <div className="pt-4 border-t border-white/5">
                  <span className="text-[10px] font-mono font-medium text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full border border-emerald-400/20">
                    {st.highlight}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. USE CASES (§11)
      ───────────────────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 border-b border-[#3F3F3F]/40 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <span className="text-xs font-mono uppercase tracking-widest text-[#A3A3A3] bg-white/5 px-3 py-1 rounded-full border border-white/10">
              Core Use Cases (§11)
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white">
              Built for Frontier AI Workflows
            </h2>
            <p className="text-sm sm:text-base text-[#A3A3A3]">
              Specialized human intelligence layers designed for every phase of model development.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "AI Training & SFT",
                desc: "Create high-quality, human-generated demonstration and reasoning datasets in code, science, law, and medicine.",
                tag: "Supervised Fine Tuning",
                icon: Brain,
              },
              {
                title: "Model Evaluation",
                desc: "Measure frontier model outputs against rigorous human expert judgment and gold-standard benchmark questions.",
                tag: "RLHF & Benchmarks",
                icon: BarChart3,
              },
              {
                title: "Agent Evaluation",
                desc: "Determine whether autonomous AI agents can execute real multi-step professional tasks without supervision.",
                tag: "Flagship Product",
                icon: Bot,
              },
              {
                title: "Expert Reasoning",
                desc: "Capture how top specialists deconstruct non-trivial edge cases to produce rich chain-of-thought training data.",
                tag: "CoT & Logic",
                icon: Zap,
              },
              {
                title: "Red Teaming & Safety",
                desc: "Identify security vulnerabilities, policy violations, hallucinations, and unsafe behavior prior to public release.",
                tag: "Adversarial Testing",
                icon: ShieldCheck,
              },
              {
                title: "Human-in-the-Loop",
                desc: "Keep verified humans in the loop for high-stakes enterprise decisions requiring continuous oversight.",
                tag: "Enterprise Supervision",
                icon: SlidersHorizontal,
              },
            ].map((uc) => {
              const Icon = uc.icon;
              return (
                <div
                  key={uc.title}
                  className="p-6 rounded-2xl bg-[#141414] border border-[#3F3F3F]/70 hover:border-white/30 transition-all flex flex-col justify-between space-y-6"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="p-2.5 rounded-xl bg-white/5 text-white border border-white/10">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-[10px] font-mono text-[#A3A3A3] uppercase px-2 py-0.5 rounded-full border border-white/10">
                        {uc.tag}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white">{uc.title}</h3>
                    <p className="text-xs text-[#A3A3A3] leading-relaxed">{uc.desc}</p>
                  </div>
                  <Link
                    href="/jobs"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-white hover:text-white/80 transition-colors"
                  >
                    <span>View active projects</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          6. FLAGSHIP AI AGENT EVALUATION SHOWCASE (§72)
      ───────────────────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 border-b border-[#3F3F3F]/40 bg-[#0E0E0E]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/20">
              Flagship Product (§72)
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white">
              AI Agent Evaluation Platform
            </h2>
            <p className="text-sm sm:text-base text-[#A3A3A3]">
              Enterprises connect autonomous agents to Hackerzone. Verified experts benchmark agent performance, correctness, edge-case safety, and task completion.
            </p>
          </div>

          {/* Interactive Agent Evaluation Dashboard Simulation */}
          <div className="bg-[#141414] border border-[#3F3F3F] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-emerald-400" />
                  <span className="text-base font-bold text-white">Agent Benchmark Suite #4092</span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full border border-emerald-400/20">
                    Live Panel
                  </span>
                </div>
                <div className="text-xs text-[#A3A3A3]">Target System: Autonomous Financial Analysis Agent v2.4</div>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href="/for-employers"
                  className="px-4 py-2 rounded-full bg-white text-black text-xs font-bold hover:bg-gray-200 transition-colors"
                >
                  Configure Agent Evaluation
                </Link>
              </div>
            </div>

            {/* Scorecard Metrics (§72) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
              {[
                { label: "Agent Score", value: "94.8 / 100", status: "Top 5%" },
                { label: "Task Success", value: "98.2%", status: "491/500 passed" },
                { label: "Expert Rating", value: "4.9 / 5.0", status: "24 verified reviews" },
                { label: "Failure Rate", value: "1.8%", status: "Minor tool timeout" },
                { label: "Hallucination Rate", value: "0.04%", status: "Near zero" },
                { label: "Human Preference", value: "89.4%", status: "vs. frontier baseline" },
              ].map((m) => (
                <div key={m.label} className="p-4 rounded-xl bg-[#1A1A1A] border border-white/10 space-y-1">
                  <div className="text-[11px] text-[#A3A3A3] font-medium">{m.label}</div>
                  <div className="text-lg font-black text-white">{m.value}</div>
                  <div className="text-[10px] font-mono text-emerald-400">{m.status}</div>
                </div>
              ))}
            </div>

            {/* Live Expert Feedback Stream */}
            <div className="p-5 rounded-2xl bg-[#1A1A1A] border border-white/10 space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-[#A3A3A3] flex items-center justify-between">
                <span>Verified Expert Feedback Log</span>
                <span className="text-[10px] font-mono text-white/50">Updated seconds ago</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-lg bg-white/5 border border-white/5 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="font-semibold text-white flex items-center gap-2">
                      <span>CFA Charterholder — Audit Task #18</span>
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-400/10 px-2 py-0.2 rounded">Passed</span>
                    </div>
                    <p className="text-[#A3A3A3] leading-relaxed">
                      &quot;The agent accurately computed non-GAAP EBITDA adjustments from 10-K notes and flagged ambiguous inventory write-downs.&quot;
                    </p>
                  </div>
                  <span className="text-[11px] text-[#A3A3A3] font-mono shrink-0">Score: 98/100</span>
                </div>
                <div className="p-3 rounded-lg bg-white/5 border border-white/5 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="font-semibold text-white flex items-center gap-2">
                      <span>Senior Security Researcher — Sandbox Boundary Test</span>
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-400/10 px-2 py-0.2 rounded">Passed</span>
                    </div>
                    <p className="text-[#A3A3A3] leading-relaxed">
                      &quot;Attempted prompt injection via adversarial PDF invoice was successfully isolated. No privileged API access granted.&quot;
                    </p>
                  </div>
                  <span className="text-[11px] text-[#A3A3A3] font-mono shrink-0">Score: 100/100</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          7. SEARCHABLE EXPERTISE DIRECTORY (§12)
      ───────────────────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 border-b border-[#3F3F3F]/40 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <span className="text-xs font-mono uppercase tracking-widest text-[#A3A3A3] bg-white/5 px-3 py-1 rounded-full border border-white/10">
              Expertise Directory (§12)
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white">
              Global Directory of Verified Expertise
            </h2>
            <p className="text-sm sm:text-base text-[#A3A3A3]">
              Explore human intelligence across 22 professional disciplines ready to be deployed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {EXPERTISE_CATEGORIES.map((cat, idx) => (
              <div
                key={cat.name}
                className="p-6 rounded-2xl bg-[#141414] border border-[#3F3F3F]/70 hover:border-white/30 transition-all space-y-4 group"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white group-hover:text-white transition-colors">
                    {cat.name}
                  </h3>
                  <span className="text-xs font-mono text-emerald-400 bg-emerald-400/10 px-2.5 py-0.5 rounded-full border border-emerald-400/20">
                    {cat.count}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {cat.skills.map((skill) => (
                    <span
                      key={skill}
                      className="text-[11px] text-[#A3A3A3] bg-white/5 px-2.5 py-1 rounded-full border border-white/5"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                <div className="pt-3 border-t border-white/5">
                  <Link
                    href={`/jobs?domain=${encodeURIComponent(cat.name)}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-white/70 hover:text-white transition-colors"
                  >
                    <span>Browse {cat.name} specialists</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          8. LIVE EXPERT PROFILES & HACKERZONE SCORE PREVIEW (§14, §15)
      ───────────────────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 border-b border-[#3F3F3F]/40 bg-[#0E0E0E]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <span className="text-xs font-mono uppercase tracking-widest text-[#A3A3A3] bg-white/5 px-3 py-1 rounded-full border border-white/10">
              Verified Profiles (§14, §15)
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white">
              The Hackerzone Intelligence Score
            </h2>
            <p className="text-sm sm:text-base text-[#A3A3A3]">
              A multi-dimensional performance score reflecting task accuracy, verified credentials, consistency, and domain depth. Never purchasable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SAMPLE_EXPERTS.map((exp) => (
              <div
                key={exp.id}
                className="p-6 rounded-2xl bg-[#141414] border border-[#3F3F3F]/70 hover:border-white/30 transition-all space-y-5"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-white">{exp.name}</h3>
                      <ShieldCheck className="h-4 w-4 text-emerald-400" />
                    </div>
                    <div className="text-xs text-white/90 font-medium">{exp.role}</div>
                    <div className="text-xs text-[#A3A3A3]">{exp.institution} · {exp.location}</div>
                  </div>

                  {/* Hackerzone Intelligence Score Badge */}
                  <div className="text-right shrink-0 bg-white/5 border border-white/10 p-2.5 rounded-xl">
                    <div className="text-[10px] font-mono uppercase text-[#A3A3A3]">HZ Score</div>
                    <div className="text-xl font-black text-white">{exp.hzScore}</div>
                    <div className="text-[10px] text-emerald-400 font-mono">Verified</div>
                  </div>
                </div>

                {/* Score Breakdown (§15) */}
                <div className="grid grid-cols-4 gap-2 pt-2 text-center text-xs">
                  <div className="p-2 rounded-lg bg-white/[0.02] border border-white/5">
                    <div className="text-[10px] text-[#A3A3A3]">Expertise</div>
                    <div className="font-bold text-white mt-0.5">{exp.components.expertise}%</div>
                  </div>
                  <div className="p-2 rounded-lg bg-white/[0.02] border border-white/5">
                    <div className="text-[10px] text-[#A3A3A3]">Task Quality</div>
                    <div className="font-bold text-white mt-0.5">{exp.components.taskQuality}%</div>
                  </div>
                  <div className="p-2 rounded-lg bg-white/[0.02] border border-white/5">
                    <div className="text-[10px] text-[#A3A3A3]">Reliability</div>
                    <div className="font-bold text-white mt-0.5">{exp.components.reliability}%</div>
                  </div>
                  <div className="p-2 rounded-lg bg-white/[0.02] border border-white/5">
                    <div className="text-[10px] text-[#A3A3A3]">Recency</div>
                    <div className="font-bold text-white mt-0.5">{exp.components.recency}%</div>
                  </div>
                </div>

                {/* Badges & Domains */}
                <div className="space-y-2 pt-1">
                  <div className="flex flex-wrap gap-1.5">
                    {exp.verified.map((badge) => (
                      <span
                        key={badge}
                        className="text-[10px] font-mono text-white/80 bg-white/10 px-2 py-0.5 rounded-md border border-white/15"
                      >
                        ✓ {badge}
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {exp.domains.map((dom) => (
                      <span
                        key={dom}
                        className="text-[11px] text-[#A3A3A3] bg-white/[0.03] px-2.5 py-0.5 rounded-full border border-white/5"
                      >
                        {dom}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer link */}
                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-[#A3A3A3]">
                  <span>{exp.stats.projects} projects completed · {exp.stats.accuracy} accuracy</span>
                  <Link href="/jobs" className="text-white hover:underline font-semibold flex items-center gap-1">
                    Request expert <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          9. ENTERPRISE SECTION (§22, §74)
      ───────────────────────────────────────────────────────────── */}
      <section className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#0E0E0E] to-[#0A0A0A] text-center space-y-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <span className="text-xs font-mono uppercase tracking-widest text-white/60 bg-white/10 px-3.5 py-1.5 rounded-full border border-white/15">
            Enterprise Human Intelligence Infrastructure (§22)
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white">
            Put human intelligence behind your AI.
          </h2>
          <p className="text-base sm:text-lg text-[#A3A3A3] max-w-2xl mx-auto leading-relaxed">
            Hackerzone gives AI companies and research organizations access to verified experts who can train models, evaluate systems, benchmark agents, and provide human judgment at scale.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/for-employers"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-black font-bold text-sm hover:bg-[#E5E5E5] transition-all hover:scale-[1.02] shadow-xl"
            >
              Talk to Hackerzone
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/jobs"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-[#3F3F3F] bg-white/5 text-white font-semibold text-sm hover:bg-white/10 transition-all"
            >
              Explore Expert Network
            </Link>
          </div>

          <div className="pt-12 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto text-xs text-[#A3A3A3]">
            <div className="space-y-1">
              <div className="text-white font-bold text-sm">Enterprise SLA</div>
              <div>Guaranteed turnaround times</div>
            </div>
            <div className="space-y-1">
              <div className="text-white font-bold text-sm">Custom Panels</div>
              <div>Dedicated domain specialists</div>
            </div>
            <div className="space-y-1">
              <div className="text-white font-bold text-sm">Tenant Isolation</div>
              <div>Strict row-level RLS boundaries</div>
            </div>
            <div className="space-y-1">
              <div className="text-white font-bold text-sm">SOC2 Architecture</div>
              <div>Signed URLs & audit trails</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
