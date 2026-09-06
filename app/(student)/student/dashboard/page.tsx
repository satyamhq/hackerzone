"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { createClient } from "@/lib/supabase/client";
import {
  getStudentProfile,
  getRecommendedJobs,
  getStudentApplications,
  getStudentEvents,
  calculateProfileCompleteness,
} from "@/lib/supabase/students";
import { Briefcase, Calendar, CheckCircle2, Clock, MapPin, Sparkles, UserCheck } from "lucide-react";

export default function StudentDashboardPage() {
  const [profile, setProfile] = useState<any>(null);
  const [recommendedJobs, setRecommendedJobs] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const studentProf = await getStudentProfile(user.id);
        setProfile(studentProf);

        const skills = studentProf?.skills || [];
        const jobs = await getRecommendedJobs(skills);
        setRecommendedJobs(jobs);

        if (studentProf?.id) {
          const apps = await getStudentApplications(studentProf.id);
          setApplications(apps);
        }

        const evs = await getStudentEvents(user.id);
        setEvents(evs);
      }

      setIsLoading(false);
    }

    loadDashboard();
  }, []);

  // Compute application counts by status
  const appCounts = {
    submitted: applications.filter((a) => a.status === "submitted").length,
    under_review: applications.filter((a) => a.status === "under_review").length,
    shortlisted: applications.filter((a) => a.status === "shortlisted").length,
    hired: applications.filter((a) => a.status === "hired").length,
  };

  const completeness = calculateProfileCompleteness(profile);

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 container py-10 flex items-center justify-center">
          <p className="text-muted-foreground">Loading your dashboard...</p>
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
            <h1 className="text-3xl font-bold">Student Dashboard</h1>
            <p className="text-muted-foreground text-sm">
              Track your career journey, applications, and recommended job roles.
            </p>
          </div>

          <Link
            href="/student/profile"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md border bg-background text-sm font-semibold hover:bg-accent"
          >
            <UserCheck className="h-4 w-4 text-primary" />
            <span>Profile Completeness: {completeness}%</span>
          </Link>
        </div>

        {/* Application Status Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="p-5 rounded-lg border bg-background shadow-sm">
            <div className="text-xs font-semibold text-muted-foreground uppercase">Submitted</div>
            <div className="text-3xl font-extrabold mt-1 text-foreground">{appCounts.submitted}</div>
          </div>
          <div className="p-5 rounded-lg border bg-background shadow-sm">
            <div className="text-xs font-semibold text-muted-foreground uppercase">Under Review</div>
            <div className="text-3xl font-extrabold mt-1 text-amber-600">{appCounts.under_review}</div>
          </div>
          <div className="p-5 rounded-lg border bg-background shadow-sm">
            <div className="text-xs font-semibold text-muted-foreground uppercase">Shortlisted</div>
            <div className="text-3xl font-extrabold mt-1 text-emerald-600">{appCounts.shortlisted}</div>
          </div>
          <div className="p-5 rounded-lg border bg-background shadow-sm">
            <div className="text-xs font-semibold text-muted-foreground uppercase">Hired</div>
            <div className="text-3xl font-extrabold mt-1 text-primary">{appCounts.hired}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column: Recommended Jobs */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Recommended Jobs (Skills Overlap Query)
              </h2>
              <Link href="/jobs" className="text-xs font-semibold text-primary hover:underline">
                View All Jobs →
              </Link>
            </div>

            {recommendedJobs.length === 0 ? (
              <div className="p-8 border rounded-lg bg-muted/20 text-center space-y-3">
                <Briefcase className="h-10 w-10 text-muted-foreground mx-auto" />
                <h3 className="font-semibold text-sm">No recommended jobs found yet</h3>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  Add more skills to your student profile to match with active tech job listings across India.
                </p>
                <Link
                  href="/student/profile"
                  className="inline-flex items-center justify-center h-9 px-4 rounded-md bg-primary text-primary-foreground text-xs font-medium"
                >
                  Update Profile Skills
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {recommendedJobs.map((job) => (
                  <div key={job.id} className="p-5 border rounded-lg bg-background shadow-sm hover:border-primary/50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-lg">{job.title}</h3>
                        <p className="text-sm text-muted-foreground">{job.companies?.name || "Verified Employer"}</p>
                      </div>
                      <span className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-semibold capitalize">
                        {job.job_type.replace("_", " ")}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-4 text-xs text-muted-foreground my-3">
                      {job.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          <span>{job.location}</span>
                        </div>
                      )}
                      {job.min_salary && job.max_salary && (
                        <div className="flex items-center gap-1 font-semibold text-foreground">
                          <span>₹{job.min_salary.toLocaleString()} - ₹{job.max_salary.toLocaleString()}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t">
                      {job.skills_required?.map((skill: string) => (
                        <span key={skill} className="text-xs px-2 py-0.5 rounded bg-muted font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar Column: Registered Events */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Upcoming Registered Events
            </h2>

            {events.length === 0 ? (
              <div className="p-6 border rounded-lg bg-muted/20 text-center space-y-2">
                <p className="text-xs text-muted-foreground">You have not registered for any campus fairs or workshops yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {events.map((reg) => (
                  <div key={reg.id} className="p-4 border rounded-lg bg-background text-sm">
                    <div className="font-semibold">{reg.events?.title}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {new Date(reg.events?.starts_at).toLocaleDateString()} • {reg.events?.location || "Virtual"}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
