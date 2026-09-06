"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { createClient } from "@/lib/supabase/client";
import { getEmployerCompany, getCompanyJobs, updateJobStatus } from "@/lib/supabase/employers";
import { Briefcase, MapPin, Plus, Users } from "lucide-react";

export default function EmployerJobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadJobs() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const emp = await getEmployerCompany(user.id);
        if (emp?.company_id) {
          setCompanyId(emp.company_id);
          const data = await getCompanyJobs(emp.company_id);
          setJobs(data);
        }
      }
      setIsLoading(false);
    }

    loadJobs();
  }, []);

  async function handleToggleStatus(jobId: string, currentStatus: string) {
    const nextStatus = currentStatus === "open" ? "closed" : "open";
    try {
      await updateJobStatus(jobId, nextStatus);
      setJobs((prev) =>
        prev.map((j) => (j.id === jobId ? { ...j, status: nextStatus } : j))
      );
    } catch (err) {
      console.error("Failed to toggle status:", err);
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 container py-10 flex items-center justify-center">
          <p className="text-muted-foreground">Loading company job postings...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 container py-10 max-w-5xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Posted Jobs</h1>
            <p className="text-muted-foreground text-sm">
              Manage your active hiring pipelines, review candidate counts, and toggle job status.
            </p>
          </div>

          <Link
            href="/employer/jobs/new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            Post New Job
          </Link>
        </div>

        {jobs.length === 0 ? (
          <div className="p-12 border rounded-lg bg-muted/20 text-center space-y-3">
            <Briefcase className="h-12 w-12 text-muted-foreground mx-auto" />
            <h3 className="font-semibold text-base">No job postings created yet</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              Post your first job opening to start receiving student applications.
            </p>
            <Link
              href="/employer/jobs/new"
              className="inline-flex items-center justify-center h-10 px-4 rounded-md bg-primary text-primary-foreground font-medium text-sm"
            >
              Create Job Posting
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => {
              const applicantCount = job.applications?.[0]?.count || 0;
              return (
                <div
                  key={job.id}
                  className="p-6 border rounded-lg bg-background shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="font-bold text-lg">{job.title}</h3>
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-semibold capitalize ${
                          job.status === "open"
                            ? "bg-emerald-100 text-emerald-800"
                            : job.status === "closed"
                            ? "bg-muted text-muted-foreground"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {job.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                      <span className="capitalize">{job.job_type.replace("_", " ")}</span>
                      {job.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          <span>{job.location}</span>
                        </div>
                      )}
                      <span>Posted on {new Date(job.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 border-t md:border-t-0 pt-3 md:pt-0">
                    <Link
                      href={`/employer/jobs/${job.id}/applicants`}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border bg-background hover:bg-accent text-xs font-semibold"
                    >
                      <Users className="h-4 w-4 text-primary" />
                      <span>{applicantCount} Applicants</span>
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleToggleStatus(job.id, job.status)}
                      className="px-3 py-1.5 rounded-md border bg-muted hover:bg-accent text-xs font-medium"
                    >
                      Mark as {job.status === "open" ? "Closed" : "Open"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
