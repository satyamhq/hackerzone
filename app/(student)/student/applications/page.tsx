"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { createClient } from "@/lib/supabase/client";
import { getStudentProfile, getStudentApplications } from "@/lib/supabase/students";
import { Briefcase, Calendar, MapPin } from "lucide-react";

export default function StudentApplicationsPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadApplications() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const studentProf = await getStudentProfile(user.id);
        if (studentProf?.id) {
          const apps = await getStudentApplications(studentProf.id);
          setApplications(apps);
        }
      }
      setIsLoading(false);
    }

    loadApplications();
  }, []);

  const filteredApps = applications.filter((app) =>
    filterStatus === "all" ? true : app.status === filterStatus
  );

  const sortedApps = [...filteredApps].sort((a, b) => {
    const timeA = new Date(a.applied_at).getTime();
    const timeB = new Date(b.applied_at).getTime();
    return sortOrder === "newest" ? timeB - timeA : timeA - timeB;
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 container py-10 flex items-center justify-center">
          <p className="text-muted-foreground">Loading your applications...</p>
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
            <h1 className="text-3xl font-bold">My Applications</h1>
            <p className="text-muted-foreground text-sm">
              Track real-time updates and review position applications you submitted.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="h-10 px-3 rounded-md border text-sm bg-background focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="all">All Statuses</option>
              <option value="submitted">Submitted</option>
              <option value="under_review">Under Review</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="rejected">Rejected</option>
              <option value="hired">Hired</option>
            </select>

            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as "newest" | "oldest")}
              className="h-10 px-3 rounded-md border text-sm bg-background focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>

        {sortedApps.length === 0 ? (
          <div className="p-12 border rounded-lg bg-muted/20 text-center space-y-3">
            <Briefcase className="h-12 w-12 text-muted-foreground mx-auto" />
            <h3 className="font-semibold text-base">No job applications found</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              Explore job openings on Hackerzone and submit your first application.
            </p>
            <Link
              href="/jobs"
              className="inline-flex items-center justify-center h-10 px-4 rounded-md bg-primary text-primary-foreground font-medium text-sm"
            >
              Browse Jobs
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedApps.map((app) => (
              <div key={app.id} className="p-6 border rounded-lg bg-background shadow-sm space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg">{app.jobs?.title || "Job Position"}</h3>
                    <p className="text-sm text-muted-foreground">{app.jobs?.companies?.name || "Company"}</p>
                  </div>

                  <span
                    className={`text-xs px-3 py-1 rounded-full font-semibold capitalize ${
                      app.status === "hired"
                        ? "bg-emerald-100 text-emerald-800"
                        : app.status === "shortlisted"
                        ? "bg-blue-100 text-blue-800"
                        : app.status === "under_review"
                        ? "bg-amber-100 text-amber-800"
                        : app.status === "rejected"
                        ? "bg-destructive/10 text-destructive"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {app.status.replace("_", " ")}
                  </span>
                </div>

                <div className="flex items-center gap-6 text-xs text-muted-foreground pt-2 border-t">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Applied on {new Date(app.applied_at).toLocaleDateString()}</span>
                  </div>
                  {app.jobs?.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      <span>{app.jobs?.location}</span>
                    </div>
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
