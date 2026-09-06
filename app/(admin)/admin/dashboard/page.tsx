"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { createClient } from "@/lib/supabase/client";
import { getAdminPlatformMetrics } from "@/lib/supabase/admin";
import { Briefcase, Building2, Flag, GraduationCap, ShieldAlert, Users, UserCheck, Zap } from "lucide-react";

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<any>({
    students: 0,
    employers: 0,
    institutionAdmins: 0,
    totalJobs: 0,
    totalApplications: 0,
    plans: { basic: 0, pro: 0, enterprise: 0 },
  });
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadAdminData() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (profile?.role === "admin") {
          setIsAdmin(true);
          const data = await getAdminPlatformMetrics();
          setMetrics(data);
        }
      }
      setIsLoading(false);
    }

    loadAdminData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 container py-10 flex items-center justify-center">
          <p className="text-muted-foreground">Verifying admin credentials...</p>
        </main>
        <Footer />
      </div>
    );
  }

  // Fail-Closed Security Guard
  if (!isAdmin) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 container py-16 text-center space-y-4 max-w-md mx-auto">
          <ShieldAlert className="h-12 w-12 text-destructive mx-auto" />
          <h1 className="text-2xl font-bold">403 Access Denied</h1>
          <p className="text-sm text-muted-foreground">
            You do not have administrative privileges to view platform operation metrics.
          </p>
          <Link href="/" className="inline-flex items-center justify-center h-10 px-6 rounded-md bg-primary text-primary-foreground font-semibold text-sm">
            Return to Homepage
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 container py-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Platform Control Center</h1>
            <p className="text-muted-foreground text-sm">
              Real-time platform operations, verification queues, and moderation management.
            </p>
          </div>
        </div>

        {/* Platform Core Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          <div className="p-6 rounded-xl border bg-background shadow-sm space-y-1">
            <div className="text-xs font-semibold text-muted-foreground uppercase">Registered Students</div>
            <div className="text-3xl font-extrabold text-foreground">{metrics.students}</div>
            <p className="text-xs text-muted-foreground">Candidate accounts</p>
          </div>

          <div className="p-6 rounded-xl border bg-background shadow-sm space-y-1">
            <div className="text-xs font-semibold text-muted-foreground uppercase">Employer Accounts</div>
            <div className="text-3xl font-extrabold text-foreground">{metrics.employers}</div>
            <p className="text-xs text-muted-foreground">Recruiter accounts</p>
          </div>

          <div className="p-6 rounded-xl border bg-background shadow-sm space-y-1">
            <div className="text-xs font-semibold text-muted-foreground uppercase">Active Job Postings</div>
            <div className="text-3xl font-extrabold text-primary">{metrics.totalJobs}</div>
            <p className="text-xs text-muted-foreground">System-wide job listings</p>
          </div>

          <div className="p-6 rounded-xl border bg-background shadow-sm space-y-1">
            <div className="text-xs font-semibold text-muted-foreground uppercase">Submitted Applications</div>
            <div className="text-3xl font-extrabold text-emerald-600">{metrics.totalApplications}</div>
            <p className="text-xs text-muted-foreground">Total marketplace submissions</p>
          </div>
        </div>

        {/* Employer Subscriptions Breakdown */}
        <div className="bg-background border rounded-xl p-6 shadow-sm mb-10 space-y-4">
          <h2 className="font-bold text-base flex items-center gap-2">
            <Zap className="h-5 w-5 text-amber-500" /> Employer Subscription Tiers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-lg bg-muted/20 border">
              <div className="text-2xl font-extrabold">{metrics.plans.basic}</div>
              <div className="text-xs font-semibold text-muted-foreground">Basic Free Tier (50 msgs)</div>
            </div>
            <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
              <div className="text-2xl font-extrabold text-primary">{metrics.plans.pro}</div>
              <div className="text-xs font-semibold text-primary">Pro Recruiter (₹10,000/mo)</div>
            </div>
            <div className="p-4 rounded-lg bg-muted/20 border">
              <div className="text-2xl font-extrabold">{metrics.plans.enterprise}</div>
              <div className="text-xs font-semibold text-muted-foreground">Enterprise Custom</div>
            </div>
          </div>
        </div>

        {/* Admin Operation Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/admin/verifications"
            className="p-6 border rounded-xl bg-background hover:border-primary/50 transition-colors shadow-sm space-y-3"
          >
            <Building2 className="h-8 w-8 text-primary" />
            <h3 className="font-bold text-lg">Verification Queues</h3>
            <p className="text-xs text-muted-foreground">Review and approve pending partner institutions and employer profiles.</p>
          </Link>

          <Link
            href="/admin/moderation"
            className="p-6 border rounded-xl bg-background hover:border-primary/50 transition-colors shadow-sm space-y-3"
          >
            <Flag className="h-8 w-8 text-destructive" />
            <h3 className="font-bold text-lg">Job Moderation</h3>
            <p className="text-xs text-muted-foreground">Review reported job listings and take unpublish enforcement actions.</p>
          </Link>

          <Link
            href="/admin/users"
            className="p-6 border rounded-xl bg-background hover:border-primary/50 transition-colors shadow-sm space-y-3"
          >
            <Users className="h-8 w-8 text-primary" />
            <h3 className="font-bold text-lg">User Management</h3>
            <p className="text-xs text-muted-foreground">Search platform users and toggle account soft-deactivation status.</p>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
