"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { createClient } from "@/lib/supabase/client";
import {
  getEmployerCompany,
  getCompanyJobs,
  checkAndDeductMessageQuota,
} from "@/lib/supabase/employers";
import { Briefcase, Building2, MessageSquare, Plus, Users, Zap } from "lucide-react";

export default function EmployerDashboardPage() {
  const [member, setMember] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [quotaRemaining, setQuotaRemaining] = useState<number>(50);
  const [planType, setPlanType] = useState<string>("basic");

  const [messagePrompt, setMessagePrompt] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadEmployerDashboard() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const emp = await getEmployerCompany(user.id);
        if (!emp || !emp.company_id) {
          setIsLoading(false);
          return;
        }
        setMember(emp);

        const companyJobs = await getCompanyJobs(emp.company_id);
        setJobs(companyJobs);

        // Fetch employer plan quota
        const { data: plan } = await supabase
          .from("employer_plans")
          .select("*")
          .eq("company_id", emp.company_id)
          .single();

        if (plan) {
          setQuotaRemaining(plan.message_quota);
          setPlanType(plan.plan);
        }
      }

      setIsLoading(false);
    }

    loadEmployerDashboard();
  }, []);

  async function handleTestOutboundMessage() {
    if (!member?.company_id) return;
    const res = await checkAndDeductMessageQuota(member.company_id);

    if (res.allowed) {
      setQuotaRemaining(res.quotaRemaining ?? quotaRemaining - 1);
      setMessagePrompt({ type: "success", text: `Outbound message sent! Quota remaining: ${res.quotaRemaining}` });
    } else {
      setMessagePrompt({ type: "error", text: res.message || "Quota exceeded. Upgrade to Pro." });
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 container py-10 flex items-center justify-center">
          <p className="text-muted-foreground">Loading employer dashboard...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!member) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 container py-16 text-center space-y-4 max-w-md mx-auto">
          <Building2 className="h-12 w-12 text-primary mx-auto" />
          <h1 className="text-2xl font-bold">Company Setup Required</h1>
          <p className="text-sm text-muted-foreground">
            You are logged in as an employer. Please set up or join a company team to start posting jobs.
          </p>
          <Link
            href="/employer/company/setup"
            className="inline-flex items-center justify-center h-10 px-6 rounded-md bg-primary text-primary-foreground font-semibold text-sm"
          >
            Setup Company Profile
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const openJobsCount = jobs.filter((j) => j.status === "open").length;
  const totalApplicants = jobs.reduce((acc, j) => acc + (j.applications?.[0]?.count || 0), 0);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 container py-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">{member.companies?.name || "Employer Dashboard"}</h1>
            <p className="text-muted-foreground text-sm">
              {member.companies?.industry || "Software Engineering"} • {member.companies?.size_range || "10-50"} Employees
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/employer/jobs/new"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90"
            >
              <Plus className="h-4 w-4" /> Post New Job
            </Link>
          </div>
        </div>

        {/* Quota & Status Banner */}
        {messagePrompt && (
          <div
            className={`p-4 mb-6 rounded-md text-sm border flex items-center justify-between ${
              messagePrompt.type === "success"
                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                : "bg-amber-50 text-amber-900 border-amber-200"
            }`}
          >
            <span>{messagePrompt.text}</span>
            {quotaRemaining === 0 && (
              <button className="px-3 py-1 rounded bg-primary text-primary-foreground text-xs font-semibold">
                Upgrade to Pro (₹10,000/mo)
              </button>
            )}
          </div>
        )}

        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="p-6 rounded-xl border bg-background shadow-sm space-y-2">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-semibold uppercase">Open Active Jobs</span>
              <Briefcase className="h-5 w-5 text-primary" />
            </div>
            <div className="text-3xl font-extrabold">{openJobsCount}</div>
            <p className="text-xs text-muted-foreground">Active listings receiving candidates</p>
          </div>

          <div className="p-6 rounded-xl border bg-background shadow-sm space-y-2">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-semibold uppercase">Total Applicants</span>
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div className="text-3xl font-extrabold">{totalApplicants}</div>
            <p className="text-xs text-muted-foreground">Submissions across all jobs</p>
          </div>

          <div className="p-6 rounded-xl border bg-background shadow-sm space-y-2">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-semibold uppercase">Outbound Quota</span>
              <Zap className="h-5 w-5 text-amber-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold">{quotaRemaining}</span>
              <span className="text-xs text-muted-foreground capitalize">({planType} Plan)</span>
            </div>
            <div className="flex items-center justify-between pt-1">
              <p className="text-xs text-muted-foreground">Monthly recruiter messages</p>
              <button
                onClick={handleTestOutboundMessage}
                className="text-xs font-semibold text-primary hover:underline"
              >
                Send Test Msg
              </button>
            </div>
          </div>
        </div>

        {/* Recent Jobs Management */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Active Job Pipelines</h2>
            <Link href="/employer/jobs" className="text-xs font-semibold text-primary hover:underline">
              View All Jobs ({jobs.length}) →
            </Link>
          </div>

          {jobs.length === 0 ? (
            <div className="p-8 border rounded-lg bg-muted/20 text-center space-y-2">
              <p className="text-sm text-muted-foreground">No active job listings posted yet.</p>
              <Link
                href="/employer/jobs/new"
                className="inline-flex items-center justify-center h-9 px-4 rounded-md bg-primary text-primary-foreground text-xs font-medium"
              >
                Post Your First Job
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {jobs.slice(0, 5).map((job) => (
                <div key={job.id} className="p-4 border rounded-lg bg-background flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-base">{job.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {job.location} • {job.job_type.replace("_", " ")}
                    </div>
                  </div>
                  <Link
                    href={`/employer/jobs/${job.id}/applicants`}
                    className="px-3 py-1.5 rounded-md border bg-background hover:bg-accent text-xs font-semibold"
                  >
                    View Applicants ({job.applications?.[0]?.count || 0})
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
