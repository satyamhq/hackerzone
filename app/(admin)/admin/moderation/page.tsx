"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { createClient } from "@/lib/supabase/client";
import { getJobReports, unpublishJob } from "@/lib/supabase/admin";
import { ArrowLeft, Flag, ShieldAlert } from "lucide-react";

export default function AdminModerationPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadReports() {
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

        if ((profile as { role?: string } | null)?.role === "admin") {
          setIsAdmin(true);
          const list = await getJobReports();
          setReports(list);
        }
      }
      setIsLoading(false);
    }

    loadReports();
  }, []);

  async function handleUnpublish(jobId: string, reportId: string) {
    try {
      await unpublishJob(jobId, reportId);
      setReports((prev) =>
        prev.map((r) => (r.id === reportId ? { ...r, status: "resolved" } : r))
      );
      setStatusMessage("Job unpublished and report marked as resolved.");
      setTimeout(() => setStatusMessage(null), 4000);
    } catch (err: any) {
      alert(`Failed to unpublish job: ${err.message}`);
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 container py-10 flex items-center justify-center">
          <p className="text-muted-foreground">Loading moderation reports...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 container py-16 text-center">
          <h1 className="text-2xl font-bold">403 Access Denied</h1>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 container py-10 max-w-5xl">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/admin/dashboard" className="p-2 rounded-md border hover:bg-accent text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Job Moderation Portal</h1>
            <p className="text-xs text-muted-foreground">Review flagged policy violations and unpublish jobs.</p>
          </div>
        </div>

        {statusMessage && (
          <div className="p-3 mb-6 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-md">
            {statusMessage}
          </div>
        )}

        {reports.length === 0 ? (
          <div className="p-12 border rounded-lg bg-muted/20 text-center space-y-2">
            <Flag className="h-10 w-10 text-muted-foreground mx-auto" />
            <h3 className="font-semibold text-sm">No job reports pending review</h3>
            <p className="text-xs text-muted-foreground">Flagged listings submitted by users will appear here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map((rep) => (
              <div key={rep.id} className="p-5 border rounded-lg bg-background shadow-sm space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-base">{rep.jobs?.title || "Job Listing"}</h3>
                    <p className="text-xs text-muted-foreground">{rep.jobs?.companies?.name || "Company"}</p>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${rep.status === "resolved" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                    {rep.status}
                  </span>
                </div>

                <div className="p-3 rounded bg-muted/40 text-xs space-y-1">
                  <div className="font-semibold text-destructive">Report Reason:</div>
                  <p>{rep.reason}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t text-xs">
                  <span className="text-muted-foreground">
                    Reported by {rep.profiles?.full_name || "User"} on {new Date(rep.created_at).toLocaleDateString()}
                  </span>

                  {rep.status !== "resolved" && (
                    <button
                      onClick={() => handleUnpublish(rep.job_id, rep.id)}
                      className="px-3 py-1.5 rounded bg-destructive text-destructive-foreground font-semibold text-xs hover:bg-destructive/90"
                    >
                      Unpublish Job Listing
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
