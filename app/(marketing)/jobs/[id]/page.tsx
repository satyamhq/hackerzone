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
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
        text: "Application submitted successfully! Your submission is now visible in your student dashboard and the employer's applicant pipeline.",
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
      <div className="flex min-h-screen flex-col bg-[#FAFBFC]">
        <Navbar />
        <main className="flex-1 max-w-7xl mx-auto px-4 py-20 flex items-center justify-center">
          <p className="text-slate-500 font-semibold">Loading position details...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex min-h-screen flex-col bg-[#FAFBFC]">
        <Navbar />
        <main className="flex-1 max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
          <h1 className="text-3xl font-extrabold text-slate-900">Position Not Found</h1>
          <p className="text-sm text-slate-500">The requested job listing does not exist or has been closed.</p>
          <Link href="/jobs">
            <Button variant="brand" className="gap-2">
              <ArrowLeft className="h-4 w-4" /> Back to All Jobs
            </Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#FAFBFC]">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-6">
        <Link href="/jobs" className="inline-flex items-center gap-1.5 text-xs font-extrabold text-blue-600 hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to Job Search
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-6">
            <Card className="p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-1">
                  <h1 className="text-3xl font-extrabold text-slate-900">{job.title}</h1>
                  <p className="text-base font-bold text-slate-500">
                    {job.companies?.name || "Verified Employer"}
                  </p>
                </div>
                <Badge variant="brand" className="w-fit text-sm capitalize">
                  {job.job_type.replace("_", " ")}
                </Badge>
              </div>

              <div className="flex flex-wrap items-center gap-6 text-xs text-slate-500 pt-3 border-t border-slate-100">
                {job.location && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-blue-600" />
                    <span className="font-semibold text-slate-700">{job.location}</span>
                  </div>
                )}
                {job.is_remote && (
                  <Badge variant="success" className="text-[11px]">
                    Remote Eligible
                  </Badge>
                )}
                {job.min_salary && job.max_salary && (
                  <span className="font-extrabold text-emerald-600 text-sm">
                    ₹{job.min_salary.toLocaleString()} - ₹{job.max_salary.toLocaleString()} / year
                  </span>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-3">
                <h3 className="font-bold text-slate-900 text-base">Required Tech Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {job.skills_required?.map((skill: string) => (
                    <span key={skill} className="text-xs px-3 py-1 rounded-full bg-slate-100 text-slate-800 font-bold">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-3">
                <h3 className="font-bold text-slate-900 text-base">Job Description</h3>
                <div className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                  {job.description}
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 flex justify-end">
                <Button onClick={handleApplyClick} variant="brand" size="lg" className="gap-2 shadow-xl shadow-blue-500/20">
                  <Send className="h-4 w-4" /> Apply for Position
                </Button>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{job.companies?.name}</h3>
                  <p className="text-xs text-slate-500">Verified Employer</p>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {job.companies?.description || "Leading technical team recruiting verified engineering talent on Hackerzone."}
              </p>
              {job.companies?.website && (
                <a
                  href={job.companies.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-xs font-bold text-blue-600 hover:underline"
                >
                  Visit Corporate Website →
                </a>
              )}
            </Card>

            <Card className="p-6 space-y-4">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-blue-600" /> Similar Openings
              </h3>
              {similarJobs.length === 0 ? (
                <p className="text-xs text-slate-500">No similar positions found right now.</p>
              ) : (
                <div className="space-y-3">
                  {similarJobs.map((simJob) => (
                    <div key={simJob.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                      <Link href={`/jobs/${simJob.id}`} className="font-bold text-slate-900 hover:text-blue-600 transition-colors block">
                        {simJob.title}
                      </Link>
                      <div className="text-slate-500 text-[11px]">
                        {simJob.companies?.name} • {simJob.location}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>

        {/* Application Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 animate-in fade-in-50">
            <Card className="w-full max-w-lg p-6 space-y-6 shadow-2xl bg-white border border-slate-100">
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <h2 className="font-extrabold text-slate-900 text-lg">Apply to {job.title}</h2>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-700">
                  <X className="h-5 w-5" />
                </button>
              </div>

              {statusMessage ? (
                <div
                  className={`p-4 rounded-2xl text-xs font-semibold ${
                    statusMessage.type === "success"
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                      : "bg-rose-50 text-rose-800 border border-rose-200"
                  }`}
                >
                  {statusMessage.text}
                </div>
              ) : (
                <form onSubmit={handleConfirmApplication} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Attached Resume
                    </label>
                    <div className="text-xs p-3.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold text-slate-700">
                      {studentProfile?.resume_url
                        ? "✓ Stored PDF Resume Attached"
                        : "⚠️ No resume PDF found on your profile. Upload one in Profile Settings."}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Cover Letter / Note to Recruiter
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      placeholder="Briefly explain why you're a great fit for this position..."
                      className="w-full p-3.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <Button type="button" onClick={() => setShowModal(false)} variant="outline" size="sm">
                      Cancel
                    </Button>
                    <Button type="submit" isLoading={isSubmitting} variant="brand" size="sm">
                      Submit Application
                    </Button>
                  </div>
                </form>
              )}
            </Card>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
