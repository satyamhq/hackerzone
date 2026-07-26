"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { createClient } from "@/utils/supabase/client";
import {
  getInstitutionAdmin,
  getAffiliatedStudentsCount,
  getAggregatePlacementStats,
} from "@/lib/supabase/institutions";
import { Calendar, Download, GraduationCap, Users, UserCheck, CheckCircle2, Clock } from "lucide-react";

export default function InstitutionDashboardPage() {
  const [instAdmin, setInstAdmin] = useState<any>(null);
  const [studentCount, setStudentCount] = useState<number>(0);
  const [placementStats, setPlacementStats] = useState<any>({
    submitted: 0,
    under_review: 0,
    shortlisted: 0,
    rejected: 0,
    hired: 0,
    total: 0,
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const adminData = await getInstitutionAdmin(user.id);
        if (!adminData || !adminData.institution_id) {
          setIsLoading(false);
          return;
        }
        setInstAdmin(adminData);

        const domain = adminData.institutions?.domain || "";
        const count = await getAffiliatedStudentsCount(domain);
        setStudentCount(count);

        const stats = await getAggregatePlacementStats(domain);
        setPlacementStats(stats);
      }

      setIsLoading(false);
    }

    loadDashboard();
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 container py-10 flex items-center justify-center">
          <p className="text-muted-foreground">Loading Career Center portal...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!instAdmin) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 container py-16 text-center space-y-4 max-w-md mx-auto">
          <GraduationCap className="h-12 w-12 text-primary mx-auto" />
          <h1 className="text-2xl font-bold">Institution Setup Required</h1>
          <p className="text-sm text-muted-foreground">
            You are logged in as an Institution Admin. Please claim or register your campus profile.
          </p>
          <Link
            href="/institution/setup"
            className="inline-flex items-center justify-center h-10 px-6 rounded-md bg-primary text-primary-foreground font-semibold text-sm"
          >
            Setup Campus Profile
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const institution = instAdmin.institutions;

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 container py-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">{institution?.name || "Career Center Portal"}</h1>
              {institution?.verified ? (
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                  Verified Partner
                </span>
              ) : (
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold">
                  Pending Verification
                </span>
              )}
            </div>
            <p className="text-muted-foreground text-sm mt-1">
              Domain: <span className="font-semibold text-foreground">{institution?.domain}</span> • {institution?.city}, {institution?.state}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={`/api/institution/export-stats?domain=${institution?.domain}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md border bg-background hover:bg-accent text-sm font-semibold"
            >
              <Download className="h-4 w-4 text-primary" /> Export Placement CSV
            </a>
            <Link
              href="/institution/events"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90"
            >
              <Calendar className="h-4 w-4" /> Manage Campus Events
            </Link>
          </div>
        </div>

        {/* Real Placement Aggregates Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          <div className="p-6 rounded-xl border bg-background shadow-sm space-y-1">
            <div className="text-xs font-semibold text-muted-foreground uppercase">Affiliated Students</div>
            <div className="text-3xl font-extrabold text-foreground">{studentCount}</div>
            <p className="text-xs text-muted-foreground">Domain matched profiles</p>
          </div>

          <div className="p-6 rounded-xl border bg-background shadow-sm space-y-1">
            <div className="text-xs font-semibold text-muted-foreground uppercase">Total Applications</div>
            <div className="text-3xl font-extrabold text-foreground">{placementStats.total}</div>
            <p className="text-xs text-muted-foreground">Submissions by campus candidates</p>
          </div>

          <div className="p-6 rounded-xl border bg-background shadow-sm space-y-1">
            <div className="text-xs font-semibold text-muted-foreground uppercase">Shortlisted</div>
            <div className="text-3xl font-extrabold text-blue-600">{placementStats.shortlisted}</div>
            <p className="text-xs text-muted-foreground">Interview stage</p>
          </div>

          <div className="p-6 rounded-xl border bg-background shadow-sm space-y-1">
            <div className="text-xs font-semibold text-muted-foreground uppercase">Confirmed Offers / Hired</div>
            <div className="text-3xl font-extrabold text-emerald-600">{placementStats.hired}</div>
            <p className="text-xs text-muted-foreground">Verified placements</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column: Quick Links & Actions */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-background border rounded-xl p-6 shadow-sm space-y-4">
              <h2 className="font-bold text-lg">Career Center Quick Navigation</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link
                  href="/institution/students"
                  className="p-5 border rounded-lg hover:border-primary/50 transition-colors bg-muted/20 flex items-center gap-4"
                >
                  <Users className="h-8 w-8 text-primary" />
                  <div>
                    <div className="font-bold text-base">Student Roster</div>
                    <div className="text-xs text-muted-foreground">View opt-in student candidate profiles</div>
                  </div>
                </Link>

                <Link
                  href="/institution/events"
                  className="p-5 border rounded-lg hover:border-primary/50 transition-colors bg-muted/20 flex items-center gap-4"
                >
                  <Calendar className="h-8 w-8 text-primary" />
                  <div>
                    <div className="font-bold text-base">Campus Fairs & Workshops</div>
                    <div className="text-xs text-muted-foreground">Create events visible on student dashboards</div>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Sidebar: RLS & Security Boundaries */}
          <div className="space-y-6">
            <div className="bg-background border rounded-xl p-6 shadow-sm space-y-3">
              <h3 className="font-bold text-base flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-primary" /> RLS Data Privacy
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Institution statistics are computed exclusively using server-side SQL queries matching your campus domain. Private student data is protected by Row Level Security.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
