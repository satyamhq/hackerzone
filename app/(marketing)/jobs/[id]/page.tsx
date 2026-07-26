"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { createClient } from "@/utils/supabase/client";
import { getJobDetails, getSimilarJobs, submitJobApplication } from "@/lib/supabase/jobs";
import { getStudentProfile } from "@/lib/supabase/students";
import { ArrowLeft, Briefcase, Building2, CheckCircle2, MapPin, Send, Sparkles, X } from "lucide-react";

export default function JobDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [job, setJob] = useState<any>(null);
  const [similarJobs, setSimilarJobs] = useState<any[]>([]);

  const [studentProfile, setStudentProfile] = useState<any>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadJobAndUser() {
      const supabase = createClient();
      const jobData = await getJobDetails(params.id);
      if (jobData) {
        setJob(jobData);
        const similar = await getSimilarJobs(params.id, jobData.skills_required || []);
        setSimilarJobs(similar);
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        setUserRole(profile?.role || "student");

        if (profile?.role === "student") {
          const studentData = await getStudentProfile(user.id);
          setStudentProfile(studentData);
        }
      }

      setIsLoading(false);
    }

    loadJobAndUser();
  }, [params.id]);

  function handleApplyClick() {
    if (!userRole) {
      router.push(`/sign-in?redirectTo=/jobs/${params.id}`);
      return;
    }
    if (userRole !== "student") {
      alert("Only registered students can apply for job positions.");
      return;
    }
    setShowModal(true);
  }

  async function handleConfirmApplication(e: React.FormEvent) {
    e.preventDefault();
    if (!studentProfile?.id) {
      alert("Please complete your student profile setup before submitting an application.");
      router.push("/student/profile");
      return;
    }

    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      await submitJobApplication(
        params.id,
        studentProfile.id,
        studentProfile.resume_url || null,
        coverLetter
      );

      setStatusMessage({
        type: "success",
        text: "Application submitted successfully! Your submission is now visible in your student dashboard and the employer's applicant review pipeline.",
      });
      setTimeout(() => {
        setShowModal(false);
      }, 2500);
    } catch (err: any) {
      setStatusMessage({ type: "error", text: err.message || "Failed to submit application." });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 container py-10 flex items-center justify-center">
          <p className="text-muted-foreground">Loading position details...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 container py-16 text-center space-y-4">
          <h1 className="text-2xl font-bold">Position Not Found</h1>
          <p className="text-sm text-muted-foreground">The requested job listing does not exist or has been closed.</p>
          <Link href="/jobs" className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
            <ArrowLeft className="h-4 w-4" /> Back to All Jobs
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 container py-10 max-w-5xl">
        <Link href="/jobs" className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Job Listings
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Job Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-background border rounded-2xl p-6 md:p-8 shadow-sm space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-extrabold">{job.title}</h1>
                  <p className="text-lg text-muted-foreground font-semibold mt-1">
                    {job.companies?.name || "Verified Employer"}
                  </p>
                </div>
                <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-semibold capitalize">
                  {job.job_type.replace("_", " ")}
                </span>
              </div>

              <div className="flex flex-wrap gap-4 text-xs text-muted-foreground pt-2 border-t">
                {job.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span>{job.location}</span>
                  </div>
                )}
                {job.is_remote && (
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                    Remote Eligible
                  </span>
                )}
                {job.min_salary && job.max_salary && (
                  <span className="font-semibold text-foreground text-sm">
                    ₹{job.min_salary.toLocaleString()} - ₹{job.max_salary.toLocaleString()} / year
                  </span>
                )}
              </div>

              <div className="pt-4 border-t space-y-3">
                <h3 className="font-bold text-base">Required Tech Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {job.skills_required?.map((skill: string) => (
                    <span key={skill} className="text-xs px-3 py-1 rounded-full bg-muted font-semibold">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t space-y-3">
                <h3 className="font-bold text-base">Job Description</h3>
                <div className="text-sm text-foreground/90 whitespace-pre-line leading-relaxed">
                  {job.description}
                </div>
              </div>

              <div className="pt-6 border-t flex justify-end">
                <button
                  onClick={handleApplyClick}
                  className="inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-primary text-primary-foreground font-bold text-sm shadow hover:bg-primary/90 transition-colors"
                >
                  <Send className="h-4 w-4" /> Apply for Position
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar: Company & Similar Jobs */}
          <div className="space-y-6">
            <div className="bg-background border rounded-xl p-6 shadow-sm space-y-3">
              <div className="flex items-center gap-3">
                <Building2 className="h-6 w-6 text-primary" />
                <h3 className="font-bold text-base">{job.companies?.name}</h3>
              </div>
              <p className="text-xs text-muted-foreground">{job.companies?.description || "Leading tech company hiring on Hackerzone."}</p>
              {job.companies?.website && (
                <a
                  href={job.companies.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-xs font-semibold text-primary hover:underline"
                >
                  Visit Company Website →
                </a>
              )}
            </div>

            {/* Similar Jobs Component */}
            <div className="bg-background border rounded-xl p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-base flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" /> Similar Openings
              </h3>
              {similarJobs.length === 0 ? (
                <p className="text-xs text-muted-foreground">No similar positions found right now.</p>
              ) : (
                <div className="space-y-3">
                  {similarJobs.map((simJob) => (
                    <div key={simJob.id} className="p-3 border rounded-lg text-xs space-y-1">
                      <Link href={`/jobs/${simJob.id}`} className="font-bold text-sm hover:text-primary">
                        {simJob.title}
                      </Link>
                      <div className="text-muted-foreground">{simJob.companies?.name} • {simJob.location}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Application Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-lg bg-background border rounded-xl p-6 shadow-xl space-y-4">
              <div className="flex justify-between items-center border-b pb-3">
                <h2 className="font-bold text-lg">Apply to {job.title}</h2>
                <button onClick={() => setShowModal(false)} className="hover:text-destructive">
                  <X className="h-5 w-5" />
                </button>
              </div>

              {statusMessage ? (
                <div
                  className={`p-4 rounded-md text-sm border ${
                    statusMessage.type === "success"
                      ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                      : "bg-destructive/10 text-destructive border-destructive/20"
                  }`}
                >
                  {statusMessage.text}
                </div>
              ) : (
                <form onSubmit={handleConfirmApplication} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
                      Attached Resume
                    </label>
                    <div className="text-sm p-3 border rounded-md bg-muted/40 font-medium">
                      {studentProfile?.resume_url ? "✓ Stored PDF Resume Attached" : "⚠️ No resume found on your profile. Upload one in Profile Settings."}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
                      Cover Letter / Note to Recruiter
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      placeholder="Briefly explain why you're a great fit for this role..."
                      className="w-full p-3 rounded-md border text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="h-10 px-4 rounded-md border text-sm font-medium hover:bg-accent"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="h-10 px-6 rounded-md bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 disabled:opacity-50"
                    >
                      {isSubmitting ? "Submitting..." : "Submit Application"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
