"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { signOutAction } from "@/app/(auth)/actions";
import { NotificationBell } from "./notification-bell";
import {
  ChevronDown,
  Menu,
  X,
  Sparkles,
  Brain,
  ShieldCheck,
  Code2,
  Stethoscope,
  Scale,
  DollarSign,
  Cpu,
  Layers,
  ArrowRight,
  BookOpen,
  HelpCircle,
  Building2,
  FileCheck2,
  Compass,
  Briefcase,
  ExternalLink,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

type MegaMenuKey = "experts" | "projects" | "solutions" | "resources" | null;

export function Navbar() {
  const [role, setRole] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<MegaMenuKey>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          setUserId(user.id);
          const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single();

          const profileData = profile as { role?: string } | null;
          setRole(profileData?.role || "student");
        }
      } catch (e) {
        // Unauthenticated
      }
    }
    loadUser();

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMouseEnter = (menu: MegaMenuKey) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveMenu(menu);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 150);
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${
        scrolled
          ? "bg-[#0A0A0A]/95 backdrop-blur-xl border-b border-[#3F3F3F]/80 shadow-2xl shadow-black/80 py-2.5"
          : "bg-[#0A0A0A] border-b border-[#3F3F3F]/40 py-3.5"
      }`}
      onMouseLeave={handleMouseLeave}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="flex items-center gap-2.5 group focus:outline-none shrink-0"
            onClick={() => setActiveMenu(null)}
          >
            <Image
              src="/hackerzone_logo.png"
              alt="Hackerzone"
              width={160}
              height={40}
              className="h-7 sm:h-8 w-auto object-contain"
              priority
            />
          </Link>

          {/* Master Mega Menu Navigation (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-medium text-[#A3A3A3]">
            {/* Experts Mega Menu */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter("experts")}
            >
              <button
                className={`flex items-center gap-1.5 px-3 py-2 rounded-full transition-colors ${
                  activeMenu === "experts"
                    ? "text-white bg-white/5"
                    : "hover:text-white"
                }`}
              >
                <span>Experts</span>
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-200 ${
                    activeMenu === "experts" ? "rotate-180 text-white" : ""
                  }`}
                />
              </button>
            </div>

            {/* Projects Mega Menu */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter("projects")}
            >
              <button
                className={`flex items-center gap-1.5 px-3 py-2 rounded-full transition-colors ${
                  activeMenu === "projects"
                    ? "text-white bg-white/5"
                    : "hover:text-white"
                }`}
              >
                <span>Projects</span>
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-200 ${
                    activeMenu === "projects" ? "rotate-180 text-white" : ""
                  }`}
                />
              </button>
            </div>

            {/* Solutions Mega Menu */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter("solutions")}
            >
              <button
                className={`flex items-center gap-1.5 px-3 py-2 rounded-full transition-colors ${
                  activeMenu === "solutions"
                    ? "text-white bg-white/5"
                    : "hover:text-white"
                }`}
              >
                <span>Solutions</span>
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-200 ${
                    activeMenu === "solutions" ? "rotate-180 text-white" : ""
                  }`}
                />
              </button>
            </div>

            {/* Resources Mega Menu */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter("resources")}
            >
              <button
                className={`flex items-center gap-1.5 px-3 py-2 rounded-full transition-colors ${
                  activeMenu === "resources"
                    ? "text-white bg-white/5"
                    : "hover:text-white"
                }`}
              >
                <span>Resources</span>
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-200 ${
                    activeMenu === "resources" ? "rotate-180 text-white" : ""
                  }`}
                />
              </button>
            </div>

            {/* Authenticated Dashboard Quick-Link */}
            {role && (
              <Link
                href={
                  role === "admin"
                    ? "/admin/dashboard"
                    : role === "recruiter" || role === "employer"
                    ? "/company/dashboard"
                    : role === "campus_admin" || role === "institution_admin"
                    ? "/campus-admin/dashboard"
                    : "/student/dashboard"
                }
                className="ml-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/10 text-white hover:bg-white/20 transition-colors border border-white/15"
              >
                Workspace
              </Link>
            )}
          </nav>
        </div>

        {/* Right Side Actions */}
        <div className="hidden lg:flex items-center gap-3">
          {!userId ? (
            <>
              <Link
                href="/for-students"
                className="text-xs font-medium text-[#A3A3A3] hover:text-white transition-colors px-3 py-2"
              >
                For Experts
              </Link>
              <Link
                href="/for-employers"
                className="text-xs font-medium text-[#A3A3A3] hover:text-white transition-colors px-3 py-2"
              >
                For Companies
              </Link>
              <div className="h-4 w-px bg-white/10 mx-1" />
              <Link
                href="/login"
                className="text-xs font-medium text-white hover:text-white/80 transition-colors px-3 py-2"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="inline-flex items-center justify-center rounded-full bg-white px-5 py-2 text-xs font-bold text-black transition-all hover:bg-[#E5E5E5] hover:scale-[1.02] shadow-sm"
              >
                Join Hackerzone
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <NotificationBell userId={userId} />
              <span className="text-xs text-[#A3A3A3] font-mono px-2.5 py-1 bg-white/5 rounded-full border border-white/10 capitalize">
                {role || "user"}
              </span>
              <form action={signOutAction}>
                <button
                  type="submit"
                  className="p-2 text-[#A3A3A3] hover:text-white hover:bg-white/5 rounded-full transition-colors"
                  title="Sign Out"
                >
                  <X className="h-4 w-4" />
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex lg:hidden items-center gap-2">
          {userId && <NotificationBell userId={userId} />}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#A3A3A3] hover:text-white focus:outline-none"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Desktop Mega Menu Flyout */}
      <AnimatePresence>
        {activeMenu && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            className="hidden lg:block absolute left-0 right-0 top-full bg-[#0E0E0E]/98 backdrop-blur-2xl border-b border-[#3F3F3F] shadow-2xl shadow-black/90 py-8 px-6"
            onMouseEnter={() => {
              if (timeoutRef.current) clearTimeout(timeoutRef.current);
            }}
            onMouseLeave={handleMouseLeave}
          >
            <div className="max-w-7xl mx-auto">
              {/* EXPERTS MEGA MENU */}
              {activeMenu === "experts" && (
                <div className="grid grid-cols-12 gap-8">
                  <div className="col-span-4 space-y-4 border-r border-white/10 pr-6">
                    <div className="text-xs font-bold uppercase tracking-wider text-white/50 flex items-center gap-1.5">
                      <Brain className="h-3.5 w-3.5 text-white" />
                      Find Work
                    </div>
                    <ul className="space-y-2 text-sm text-[#F5F5F5]">
                      {[
                        { label: "AI Training & Data Generation", desc: "Create high-quality expert reasoning datasets", href: "/jobs?category=ai-training" },
                        { label: "AI & Model Evaluation", desc: "Benchmark frontier LLMs against domain judgment", href: "/jobs?category=ai-evaluation" },
                        { label: "AI Agent Evaluation", desc: "Stress test autonomous agents on complex workflows", href: "/arena" },
                        { label: "Expert Tasks & Reasoning", desc: "Structured problem-solving in high-stakes fields", href: "/jobs" },
                        { label: "Red Teaming & Safety Testing", desc: "Identify hallucinations, vulnerabilities & edge cases", href: "/jobs?category=red-teaming" },
                        { label: "Research Projects", desc: "Participate in academic and frontier lab studies", href: "/jobs?category=research" },
                      ].map((item) => (
                        <li key={item.label}>
                          <Link
                            href={item.href}
                            onClick={() => setActiveMenu(null)}
                            className="group block p-2 rounded-lg hover:bg-white/5 transition-colors"
                          >
                            <div className="font-semibold text-white group-hover:text-white flex items-center justify-between text-xs">
                              {item.label}
                              <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <div className="text-[11px] text-[#A3A3A3] mt-0.5">{item.desc}</div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="col-span-4 space-y-4 border-r border-white/10 pr-6">
                    <div className="text-xs font-bold uppercase tracking-wider text-white/50 flex items-center gap-1.5">
                      <Layers className="h-3.5 w-3.5 text-white" />
                      Explore Expertise Domains
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-[#A3A3A3]">
                      {[
                        "Software Engineering",
                        "AI / ML & Data Science",
                        "Mathematics & Logic",
                        "Medicine & Healthcare",
                        "Law & Jurisprudence",
                        "Finance & Economics",
                        "Cybersecurity",
                        "Physics & Chemistry",
                        "Languages & Linguistics",
                        "Product & Design",
                        "Business & Strategy",
                        "Other Specialties",
                      ].map((domain) => (
                        <Link
                          key={domain}
                          href={`/jobs?domain=${encodeURIComponent(domain)}`}
                          onClick={() => setActiveMenu(null)}
                          className="p-2 rounded-md hover:bg-white/5 hover:text-white transition-colors text-[12px] font-medium"
                        >
                          {domain}
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className="col-span-4 space-y-6 pl-2">
                    <div className="bg-gradient-to-br from-[#161616] to-[#1F1F1F] border border-[#3F3F3F] p-6 rounded-2xl space-y-4">
                      <div className="inline-flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-white/10 text-white border border-white/15">
                        <ShieldCheck className="h-3 w-3" />
                        Verified Expert Network
                      </div>
                      <h4 className="text-base font-bold text-white leading-snug">
                        Turn Your Expertise Into Intelligence for Frontier AI
                      </h4>
                      <p className="text-xs text-[#A3A3A3] leading-relaxed">
                        Earn from rigorous evaluations, model supervision, and research tasks. Get verified once and access global opportunities.
                      </p>
                      <Link
                        href="/sign-up"
                        onClick={() => setActiveMenu(null)}
                        className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold text-black hover:bg-gray-200 transition-colors"
                      >
                        Become a Hackerzone Expert
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* PROJECTS MEGA MENU */}
              {activeMenu === "projects" && (
                <div className="grid grid-cols-12 gap-8">
                  <div className="col-span-7 space-y-4 border-r border-white/10 pr-8">
                    <div className="text-xs font-bold uppercase tracking-wider text-white/50 flex items-center gap-1.5">
                      <Compass className="h-3.5 w-3.5 text-white" />
                      Active Intelligence Project Categories
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { title: "Browse All Projects", desc: "View open tasks across engineering, science, law & finance", href: "/jobs" },
                        { title: "AI Training Workflows", desc: "High-quality human-in-the-loop reasoning datasets", href: "/jobs?category=ai-training" },
                        { title: "Model Evaluation", desc: "Rigorous benchmarking against human gold standards", href: "/jobs?category=ai-evaluation" },
                        { title: "AI Agent Evaluation", desc: "Assess multi-step autonomy, tool use, and failure modes", href: "/arena" },
                        { title: "Red Teaming & Safety", desc: "Uncover adversarial attacks, jailbreaks, and hallucinations", href: "/jobs?category=red-teaming" },
                        { title: "Specialized Research Tasks", desc: "Domain-specific panels for frontier lab studies", href: "/jobs?category=research" },
                      ].map((item) => (
                        <Link
                          key={item.title}
                          href={item.href}
                          onClick={() => setActiveMenu(null)}
                          className="group p-3 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/5 hover:border-white/15 transition-all"
                        >
                          <div className="font-semibold text-white text-xs group-hover:text-white flex items-center justify-between">
                            {item.title}
                            <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <div className="text-[11px] text-[#A3A3A3] mt-1">{item.desc}</div>
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className="col-span-5 space-y-4 pl-2">
                    <div className="text-xs font-bold uppercase tracking-wider text-white/50">
                      Live Assessment Spotlight
                    </div>
                    <div className="p-5 rounded-2xl bg-[#161616] border border-[#3F3F3F] space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-mono text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full border border-emerald-400/20">
                          Live Benchmark
                        </span>
                        <span className="text-[11px] text-[#A3A3A3]">120+ Open Openings</span>
                      </div>
                      <h4 className="text-sm font-bold text-white">
                        AI Agent Code Reasoning & Bug Injection Benchmark
                      </h4>
                      <p className="text-xs text-[#A3A3A3] leading-relaxed">
                        Top software engineers evaluate whether autonomous agents can resolve production-grade race conditions and memory leaks.
                      </p>
                      <Link
                        href="/arena"
                        onClick={() => setActiveMenu(null)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-white hover:underline pt-1"
                      >
                        Explore Skill Arena Challenges <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* SOLUTIONS MEGA MENU */}
              {activeMenu === "solutions" && (
                <div className="grid grid-cols-12 gap-8">
                  <div className="col-span-4 space-y-3 border-r border-white/10 pr-6">
                    <div className="text-xs font-bold uppercase tracking-wider text-white/50 flex items-center gap-1.5">
                      <Cpu className="h-3.5 w-3.5 text-white" />
                      For AI Labs & Startups
                    </div>
                    <ul className="space-y-2 text-xs text-[#A3A3A3]">
                      {[
                        "Model Training & Post-Training RLHF",
                        "Human Evaluation & Benchmarking",
                        "Red Teaming & Safety Testing",
                        "Expert Reasoning & Chain-of-Thought Data",
                        "Multi-Modal Data Generation",
                      ].map((item) => (
                        <li key={item}>
                          <Link
                            href="/for-employers"
                            onClick={() => setActiveMenu(null)}
                            className="block p-2 rounded-lg hover:bg-white/5 hover:text-white transition-colors"
                          >
                            {item}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="col-span-4 space-y-3 border-r border-white/10 pr-6">
                    <div className="text-xs font-bold uppercase tracking-wider text-white/50 flex items-center gap-1.5">
                      <Building2 className="h-3.5 w-3.5 text-white" />
                      For Enterprises
                    </div>
                    <ul className="space-y-2 text-xs text-[#A3A3A3]">
                      {[
                        "AI Agent Evaluation & Task Success Testing",
                        "Domain Expertise Integration (Finance, Law, Med)",
                        "Human-in-the-Loop Supervision Systems",
                        "Custom Expert Panels on Demand",
                        "Enterprise Research & SLA-backed Workforces",
                      ].map((item) => (
                        <li key={item}>
                          <Link
                            href="/for-employers"
                            onClick={() => setActiveMenu(null)}
                            className="block p-2 rounded-lg hover:bg-white/5 hover:text-white transition-colors"
                          >
                            {item}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="col-span-4 space-y-4 pl-2">
                    <div className="p-6 rounded-2xl bg-[#161616] border border-[#3F3F3F] space-y-4">
                      <span className="text-[11px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-white/10 text-white border border-white/15">
                        Enterprise Infrastructure
                      </span>
                      <h4 className="text-base font-bold text-white">
                        Put Human Intelligence Behind Your AI
                      </h4>
                      <p className="text-xs text-[#A3A3A3] leading-relaxed">
                        Access verified humans with deep domain credentials. Enterprise-grade security, isolated workspaces, and full auditability.
                      </p>
                      <Link
                        href="/for-employers"
                        onClick={() => setActiveMenu(null)}
                        className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold text-black hover:bg-gray-200 transition-colors"
                      >
                        Talk to Hackerzone
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* RESOURCES MEGA MENU */}
              {activeMenu === "resources" && (
                <div className="grid grid-cols-12 gap-8">
                  <div className="col-span-8 grid grid-cols-2 gap-4 border-r border-white/10 pr-8">
                    {[
                      { title: "Research & Reports", desc: "The state of human intelligence and workforce trends in the AI economy", href: "/about" },
                      { title: "Expert Playbook", desc: "How verification, assessment scores, and payout pipelines work", href: "/for-students" },
                      { title: "Enterprise Guide", desc: "Architecting human-in-the-loop supervision and agent evaluations", href: "/for-employers" },
                      { title: "Help Center & FAQ", desc: "Guides, platform documentation, and technical support", href: "/about" },
                      { title: "Hackerzone Skill Arena", desc: "Explore coding sandboxes, leaderboards, and verified badges", href: "/arena" },
                      { title: "Platform Security & Trust", desc: "Row-level data isolation, signed URLs, and audit logging specs", href: "/legal/privacy" },
                    ].map((item) => (
                      <Link
                        key={item.title}
                        href={item.href}
                        onClick={() => setActiveMenu(null)}
                        className="group p-3 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/5 hover:border-white/15 transition-all"
                      >
                        <div className="font-semibold text-white text-xs group-hover:text-white flex items-center justify-between">
                          {item.title}
                          <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="text-[11px] text-[#A3A3A3] mt-1">{item.desc}</div>
                      </Link>
                    ))}
                  </div>

                  <div className="col-span-4 pl-2 space-y-4">
                    <div className="text-xs font-bold uppercase tracking-wider text-white/50">
                      Core Mission
                    </div>
                    <div className="p-5 rounded-2xl bg-[#161616] border border-[#3F3F3F] space-y-2">
                      <p className="text-sm font-bold text-white">
                        &quot;Organize human intelligence to power the AI economy.&quot;
                      </p>
                      <p className="text-xs text-[#A3A3A3] leading-relaxed pt-1">
                        We build the foundational layer connecting verified human expertise with frontier models and autonomous systems.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-[#0A0A0A] border-b border-[#3F3F3F] px-4 pt-4 pb-6 space-y-5"
          >
            <div className="flex flex-col gap-2 text-sm text-white">
              <Link
                href="/jobs"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-white/5 flex items-center justify-between"
              >
                <span>Browse Projects</span>
                <ArrowRight className="h-4 w-4 text-[#A3A3A3]" />
              </Link>
              <Link
                href="/arena"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-white/5 flex items-center justify-between"
              >
                <span>Skill Arena & Benchmarks</span>
                <ArrowRight className="h-4 w-4 text-[#A3A3A3]" />
              </Link>
              <Link
                href="/for-students"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-white/5 flex items-center justify-between"
              >
                <span>For Experts</span>
                <ArrowRight className="h-4 w-4 text-[#A3A3A3]" />
              </Link>
              <Link
                href="/for-employers"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-white/5 flex items-center justify-between"
              >
                <span>For Companies & AI Labs</span>
                <ArrowRight className="h-4 w-4 text-[#A3A3A3]" />
              </Link>
              <Link
                href="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-white/5 flex items-center justify-between"
              >
                <span>About & Research</span>
                <ArrowRight className="h-4 w-4 text-[#A3A3A3]" />
              </Link>
            </div>

            <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
              {!userId ? (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2.5 rounded-full border border-white/20 text-xs font-semibold text-white hover:bg-white/5"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/sign-up"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2.5 rounded-full bg-white text-xs font-bold text-black hover:bg-gray-200"
                  >
                    Join Hackerzone
                  </Link>
                </>
              ) : (
                <form action={signOutAction}>
                  <Button type="submit" variant="dark" className="w-full justify-center">
                    Sign Out
                  </Button>
                </form>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
