"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { createClient } from "@/lib/supabase/client";
import { getEmployerCompany, createJob } from "@/lib/supabase/employers";
import { createJobSchema } from "@/lib/validators";
import { Plus, X } from "lucide-react";

export default function NewJobPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [companyId, setCompanyId] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [jobType, setJobType] = useState<"full_time" | "internship" | "part_time" | "freelance" | "gig">("full_time");
  const [location, setLocation] = useState("Bengaluru, India");
  const [isRemote, setIsRemote] = useState(false);
  const [minSalary, setMinSalary] = useState<number | "">(600000);
  const [maxSalary, setMaxSalary] = useState<number | "">(1200000);
  const [skillsRequired, setSkillsRequired] = useState<string[]>([]);
  const [status, setStatus] = useState<"draft" | "open">("open");

  const [skillInput, setSkillInput] = useState("");
  const [availableSkills, setAvailableSkills] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function init() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setUserId(user.id);
        const emp = await getEmployerCompany(user.id);
        if (!emp || !emp.company_id) {
          router.push("/employer/company/setup");
          return;
        }
        setCompanyId(emp.company_id);
      }

      // Fetch canonical skills
      const { data: skillsData } = await supabase.from("skills").select("name");
      if (skillsData) {
        setAvailableSkills(skillsData.map((s) => s.name));
      }

      setIsLoading(false);
    }
    init();
  }, [router]);

  function handleAddSkill(s: string) {
    const trimmed = s.trim();
    if (!trimmed) return;
    if (!skillsRequired.includes(trimmed)) {
      setSkillsRequired([...skillsRequired, trimmed]);
    }
    setSkillInput("");
  }

  function handleRemoveSkill(s: string) {
    setSkillsRequired(skillsRequired.filter((item) => item !== s));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!userId || !companyId) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    // Zod Validation
    const validationResult = createJobSchema.safeParse({
      title,
      description,
      job_type: jobType,
      location,
      is_remote: isRemote,
      min_salary: minSalary === "" ? undefined : Number(minSalary),
      max_salary: maxSalary === "" ? undefined : Number(maxSalary),
      skills_required: skillsRequired,
      status,
    });

    if (!validationResult.success) {
      const firstError = validationResult.error.errors[0]?.message || "Validation failed.";
      setErrorMessage(firstError);
      setIsSubmitting(false);
      return;
    }

    try {
      await createJob(userId, companyId, {
        title,
        description,
        job_type: jobType,
        location,
        is_remote: isRemote,
        min_salary: minSalary === "" ? null : Number(minSalary),
        max_salary: maxSalary === "" ? null : Number(maxSalary),
        skills_required: skillsRequired,
        status,
      });

      router.push("/employer/jobs");
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to post job.");
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 container py-10 flex items-center justify-center">
          <p className="text-muted-foreground">Loading job creation form...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 container py-10 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Post a New Job</h1>
          <p className="text-muted-foreground text-sm">
            Create an active job listing to connect with top engineering talent across India.
          </p>
        </div>

        {errorMessage && (
          <div className="p-4 mb-6 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-background border rounded-xl p-6 space-y-6 shadow-sm">
          <div>
            <label className="block text-sm font-medium mb-1">Job Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Senior Frontend Engineer (React / Next.js)"
              className="w-full h-10 px-3 rounded-md border text-sm focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Job Type</label>
              <select
                value={jobType}
                onChange={(e) => setJobType(e.target.value as any)}
                className="w-full h-10 px-3 rounded-md border text-sm bg-background focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="full_time">Full Time</option>
                <option value="internship">Internship</option>
                <option value="part_time">Part Time</option>
                <option value="freelance">Freelance</option>
                <option value="gig">Gig / Project</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full h-10 px-3 rounded-md border text-sm bg-background focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="open">Open (Publish Now)</option>
                <option value="draft">Draft (Save Only)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Bengaluru, Karnataka"
                className="w-full h-10 px-3 rounded-md border text-sm focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>

            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="isRemote"
                checked={isRemote}
                onChange={(e) => setIsRemote(e.target.checked)}
                className="h-4 w-4 rounded border-input text-primary focus:ring-ring"
              />
              <label htmlFor="isRemote" className="text-sm font-medium">
                Remote Eligible Position
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Min Salary (INR / Year)</label>
              <input
                type="number"
                value={minSalary}
                onChange={(e) => setMinSalary(e.target.value === "" ? "" : Number(e.target.value))}
                placeholder="600000"
                className="w-full h-10 px-3 rounded-md border text-sm focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Max Salary (INR / Year)</label>
              <input
                type="number"
                value={maxSalary}
                onChange={(e) => setMaxSalary(e.target.value === "" ? "" : Number(e.target.value))}
                placeholder="1200000"
                className="w-full h-10 px-3 rounded-md border text-sm focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
          </div>

          {/* Required Skills Multi-select */}
          <div>
            <label className="block text-sm font-medium mb-1">Required Skills (Matching Tagging)</label>

            <div className="flex flex-wrap gap-2 mb-3">
              {skillsRequired.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary font-medium text-xs"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="hover:text-destructive transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddSkill(skillInput);
                  }
                }}
                placeholder="Type skill and press Enter..."
                className="flex-1 h-10 px-3 rounded-md border text-sm focus:outline-none focus:ring-1 focus:ring-ring"
              />
              <button
                type="button"
                onClick={() => handleAddSkill(skillInput)}
                className="inline-flex items-center gap-1 h-10 px-4 rounded-md bg-secondary text-secondary-foreground font-medium text-sm hover:bg-secondary/80"
              >
                <Plus className="h-4 w-4" /> Add
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 mt-2">
              {availableSkills
                .filter((s) => !skillsRequired.includes(s))
                .slice(0, 8)
                .map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => handleAddSkill(s)}
                    className="text-xs px-2 py-0.5 rounded bg-muted hover:bg-accent text-muted-foreground hover:text-foreground"
                  >
                    + {s}
                  </button>
                ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Job Description</label>
            <textarea
              rows={6}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe roles, key responsibilities, and required qualifications..."
              className="w-full p-3 rounded-md border text-sm focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => router.back()}
              className="h-10 px-4 rounded-md border text-sm font-medium hover:bg-accent"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-10 px-6 rounded-md bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 disabled:opacity-50"
            >
              {isSubmitting ? "Posting Job..." : "Publish Job Opening"}
            </button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
