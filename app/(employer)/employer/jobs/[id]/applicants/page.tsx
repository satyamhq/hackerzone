"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { createClient } from "@/lib/supabase/client";
import { getJobApplicants, updateApplicationStatus } from "@/lib/supabase/employers";
import { getSignedResumeUrl } from "@/lib/supabase/students";
import { ArrowLeft, ExternalLink, FileText, UserCheck, Users } from "lucide-react";

export default function ApplicantsPage({ params }: { params: { id: string } }) {
  const [applicants, setApplicants] = useState<any[]>([]);
  const [jobTitle, setJobTitle] = useState("Job Opening");
  const [signedUrls, setSignedUrls] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadApplicantsData() {
      const supabase = createClient();

      // Fetch Job Title
      const { data: job } = await supabase
        .from("jobs")
        .select("title")
        .eq("id", params.id)
        .single();

      if (job) {
        setJobTitle(job.title);
      }

      const list = await getJobApplicants(params.id);
      setApplicants(list);

      // Generate signed URLs for resumes
      const urlMap: Record<string, string> = {};
      for (const app of list) {
        if (app.resume_url || app.students?.resume_url) {
          const path = app.resume_url || app.students?.resume_url;
          const signed = await getSignedResumeUrl(path);
          if (signed) {
            urlMap[app.id] = signed;
          }
        }
      }
      setSignedUrls(urlMap);
      setIsLoading(false);
    }

    loadApplicantsData();
  }, [params.id]);

  async function handleStatusChange(applicationId: string, studentUserId: string, newStatus: any) {
    try {
      await updateApplicationStatus(applicationId, studentUserId, newStatus, jobTitle);
      setApplicants((prev) =>
        prev.map((app) => (app.id === applicationId ? { ...app, status: newStatus } : app))
      );
      setStatusMessage(`Updated application status to ${newStatus.replace("_", " ")} and sent notification.`);
      setTimeout(() => setStatusMessage(null), 4000);
    } catch (err: any) {
      alert(`Error updating status: ${err.message}`);
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 container py-10 flex items-center justify-center">
          <p className="text-muted-foreground">Loading candidate applications...</p>
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
          <Link href="/employer/jobs" className="p-2 rounded-md border hover:bg-accent text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold">{jobTitle} — Candidates</h1>
            <p className="text-muted-foreground text-xs">Review resumes and update application stages.</p>
          </div>
        </div>

        {statusMessage && (
          <div className="p-3 mb-6 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-md">
            {statusMessage}
          </div>
        )}

        {applicants.length === 0 ? (
          <div className="p-12 border rounded-lg bg-muted/20 text-center space-y-2">
            <Users className="h-10 w-10 text-muted-foreground mx-auto" />
            <h3 className="font-semibold text-sm">No applications received yet</h3>
            <p className="text-xs text-muted-foreground">Candidate submissions for this position will appear here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {applicants.map((app) => {
              const student = app.students;
              const profile = student?.profiles;

              return (
                <div key={app.id} className="p-6 border rounded-lg bg-background shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                        {profile?.full_name?.charAt(0) || "S"}
                      </div>
                      <div>
                        <div className="font-bold text-base">{profile?.full_name || "Student Candidate"}</div>
                        <div className="text-xs text-muted-foreground">{student?.headline || "Engineering Student"}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <label className="text-xs font-medium text-muted-foreground">Stage:</label>
                      <select
                        value={app.status}
                        onChange={(e) =>
                          handleStatusChange(app.id, student?.user_id, e.target.value as any)
                        }
                        className="h-9 px-3 rounded-md border text-xs bg-background focus:outline-none focus:ring-1 focus:ring-ring font-semibold"
                      >
                        <option value="submitted">Submitted</option>
                        <option value="under_review">Under Review</option>
                        <option value="shortlisted">Shortlisted</option>
                        <option value="rejected">Rejected</option>
                        <option value="hired">Hired</option>
                      </select>
                    </div>
                  </div>

                  {student?.skills && student.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2 border-t">
                      {student.skills.map((skill: string) => (
                        <span key={skill} className="text-xs px-2.5 py-0.5 rounded-full bg-muted font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t text-xs">
                    <span className="text-muted-foreground">
                      Applied on {new Date(app.applied_at).toLocaleDateString()}
                    </span>

                    <div className="flex items-center gap-3">
                      {student?.id && (
                        <Link
                          href={`/student/${student.id}`}
                          target="_blank"
                          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                        >
                          <UserCheck className="h-3.5 w-3.5" /> View Profile
                        </Link>
                      )}

                      {signedUrls[app.id] ? (
                        <a
                          href={signedUrls[app.id]}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                        >
                          <FileText className="h-3.5 w-3.5" /> View Resume (PDF) <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : (
                        <span className="text-xs text-muted-foreground italic">No resume attached</span>
                      )}
                    </div>
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
