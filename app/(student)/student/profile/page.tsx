"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { createClient } from "@/utils/supabase/client";
import {
  getStudentProfile,
  upsertStudentProfile,
  uploadResume,
  getSignedResumeUrl,
  calculateProfileCompleteness,
  StudentProfileData,
} from "@/lib/supabase/students";
import { CheckCircle2, FileText, Globe, Github, Linkedin, Plus, Upload, X } from "lucide-react";

export default function StudentProfilePage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<Partial<StudentProfileData>>({
    headline: "",
    bio: "",
    graduation_year: 2026,
    location: "",
    skills: [],
    links: { github: "", linkedin: "", portfolio: "" },
    is_public: false,
    resume_url: null,
  });

  const [availableSkills, setAvailableSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [signedResumeUrl, setSignedResumeUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setUserId(user.id);
        const existingProfile = await getStudentProfile(user.id);
        if (existingProfile) {
          setProfile({
            ...existingProfile,
            links: existingProfile.links || { github: "", linkedin: "", portfolio: "" },
            skills: existingProfile.skills || [],
          });

          if (existingProfile.resume_url) {
            const url = await getSignedResumeUrl(existingProfile.resume_url);
            setSignedResumeUrl(url);
          }
        }
      }

      // Fetch skills from database
      const { data: skillsData } = await supabase.from("skills").select("name");
      if (skillsData) {
        setAvailableSkills(skillsData.map((s) => s.name));
      }

      setIsLoading(false);
    }

    loadData();
  }, []);

  const completeness = calculateProfileCompleteness(profile);

  function handleAddSkill(skillName: string) {
    const trimmed = skillName.trim();
    if (!trimmed) return;
    if (!profile.skills?.includes(trimmed)) {
      setProfile((prev) => ({
        ...prev,
        skills: [...(prev.skills || []), trimmed],
      }));
    }
    setSkillInput("");
  }

  function handleRemoveSkill(skillName: string) {
    setProfile((prev) => ({
      ...prev,
      skills: (prev.skills || []).filter((s) => s !== skillName),
    }));
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !userId) return;

    if (file.type !== "application/pdf") {
      setStatusMessage({ type: "error", text: "Only PDF resumes are supported." });
      return;
    }

    setIsUploading(true);
    setStatusMessage(null);

    try {
      const path = await uploadResume(userId, file);
      setProfile((prev) => ({ ...prev, resume_url: path }));
      const url = await getSignedResumeUrl(path);
      setSignedResumeUrl(url);
      setStatusMessage({ type: "success", text: "Resume uploaded successfully!" });
    } catch (err: any) {
      setStatusMessage({ type: "error", text: err.message || "Failed to upload resume." });
    } finally {
      setIsUploading(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!userId) return;

    setIsSaving(true);
    setStatusMessage(null);

    try {
      await upsertStudentProfile(userId, profile);
      setStatusMessage({ type: "success", text: "Profile updated successfully!" });
    } catch (err: any) {
      setStatusMessage({ type: "error", text: err.message || "Failed to save profile." });
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 container py-10 flex items-center justify-center">
          <p className="text-muted-foreground">Loading profile editor...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 container py-10 max-w-4xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Edit Student Profile</h1>
            <p className="text-muted-foreground text-sm">
              Keep your information updated for top employers and campus recruiters.
            </p>
          </div>

          {/* Profile Completeness Indicator */}
          <div className="bg-background border rounded-lg p-4 flex items-center gap-4 shadow-sm min-w-[240px]">
            <div className="relative flex items-center justify-center w-12 h-12 rounded-full border-4 border-primary/20 text-primary font-bold text-xs">
              {completeness}%
            </div>
            <div>
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Profile Completeness
              </div>
              <div className="text-sm font-bold">
                {completeness === 100 ? "Complete!" : "Incomplete Profile"}
              </div>
            </div>
          </div>
        </div>

        {statusMessage && (
          <div
            className={`p-4 mb-6 rounded-md text-sm border ${
              statusMessage.type === "success"
                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                : "bg-destructive/10 text-destructive border-destructive/20"
            }`}
          >
            {statusMessage.text}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-8">
          {/* Headline & Bio */}
          <div className="bg-background border rounded-lg p-6 space-y-4 shadow-sm">
            <h2 className="font-semibold text-lg border-b pb-2">Basic Info</h2>

            <div>
              <label className="block text-sm font-medium mb-1">Headline</label>
              <input
                type="text"
                value={profile.headline || ""}
                onChange={(e) => setProfile({ ...profile, headline: e.target.value })}
                placeholder="e.g. Final Year CS Undergrad @ IIT Bombay | Full-Stack Developer"
                className="w-full h-10 px-3 rounded-md border text-sm focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Bio</label>
              <textarea
                rows={4}
                value={profile.bio || ""}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                placeholder="Write a brief overview of your background, achievements, and tech interests..."
                className="w-full p-3 rounded-md border text-sm focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Graduation Year</label>
                <input
                  type="number"
                  value={profile.graduation_year || 2026}
                  onChange={(e) => setProfile({ ...profile, graduation_year: parseInt(e.target.value) || undefined })}
                  className="w-full h-10 px-3 rounded-md border text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Location</label>
                <input
                  type="text"
                  value={profile.location || ""}
                  onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                  placeholder="e.g. Mumbai, India"
                  className="w-full h-10 px-3 rounded-md border text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>
            </div>
          </div>

          {/* Skills Selection */}
          <div className="bg-background border rounded-lg p-6 space-y-4 shadow-sm">
            <h2 className="font-semibold text-lg border-b pb-2">Skills & Technologies</h2>

            <div className="flex flex-wrap gap-2 mb-3">
              {profile.skills?.map((skill) => (
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
                placeholder="Type a skill (e.g. React, Python) and hit Enter or click Add"
                className="flex-1 h-10 px-3 rounded-md border text-sm focus:outline-none focus:ring-1 focus:ring-ring"
              />
              <button
                type="button"
                onClick={() => handleAddSkill(skillInput)}
                className="inline-flex items-center gap-1 h-10 px-4 rounded-md bg-secondary text-secondary-foreground font-medium text-sm hover:bg-secondary/80"
              >
                <Plus className="h-4 w-4" />
                Add Skill
              </button>
            </div>

            {/* Suggested Skill Pills */}
            <div className="pt-2">
              <div className="text-xs font-semibold text-muted-foreground mb-2">Suggested Skills:</div>
              <div className="flex flex-wrap gap-1.5">
                {availableSkills
                  .filter((s) => !profile.skills?.includes(s))
                  .slice(0, 10)
                  .map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => handleAddSkill(s)}
                      className="text-xs px-2.5 py-1 rounded-md bg-muted hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                    >
                      + {s}
                    </button>
                  ))}
              </div>
            </div>
          </div>

          {/* Resume Upload Section */}
          <div className="bg-background border rounded-lg p-6 space-y-4 shadow-sm">
            <h2 className="font-semibold text-lg border-b pb-2">Resume Document (Private Bucket)</h2>
            <p className="text-xs text-muted-foreground">
              Resumes are stored securely in a private bucket. Only employers receiving your application can generate a temporary signed view URL.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-medium cursor-pointer hover:bg-primary/90 transition-colors">
                <Upload className="h-4 w-4" />
                {isUploading ? "Uploading PDF..." : "Upload Resume (PDF)"}
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  className="hidden"
                />
              </label>

              {signedResumeUrl && (
                <a
                  href={signedResumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-primary font-medium hover:underline"
                >
                  <FileText className="h-4 w-4" />
                  View Current Resume (Signed URL)
                </a>
              )}
            </div>
          </div>

          {/* Links & Visibility */}
          <div className="bg-background border rounded-lg p-6 space-y-4 shadow-sm">
            <h2 className="font-semibold text-lg border-b pb-2">Online Presence & Public Visibility</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 flex items-center gap-1.5">
                  <Github className="h-4 w-4" /> GitHub URL
                </label>
                <input
                  type="url"
                  value={profile.links?.github || ""}
                  onChange={(e) =>
                    setProfile({ ...profile, links: { ...profile.links, github: e.target.value } })
                  }
                  placeholder="https://github.com/username"
                  className="w-full h-10 px-3 rounded-md border text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 flex items-center gap-1.5">
                  <Linkedin className="h-4 w-4" /> LinkedIn URL
                </label>
                <input
                  type="url"
                  value={profile.links?.linkedin || ""}
                  onChange={(e) =>
                    setProfile({ ...profile, links: { ...profile.links, linkedin: e.target.value } })
                  }
                  placeholder="https://linkedin.com/in/username"
                  className="w-full h-10 px-3 rounded-md border text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 flex items-center gap-1.5">
                  <Globe className="h-4 w-4" /> Portfolio URL
                </label>
                <input
                  type="url"
                  value={profile.links?.portfolio || ""}
                  onChange={(e) =>
                    setProfile({ ...profile, links: { ...profile.links, portfolio: e.target.value } })
                  }
                  placeholder="https://yourwebsite.dev"
                  className="w-full h-10 px-3 rounded-md border text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>
            </div>

            <div className="pt-2 border-t flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">Public Profile Searchability</div>
                <div className="text-xs text-muted-foreground">
                  Allow employers on Hackerzone to discover your profile in public talent searches.
                </div>
              </div>
              <input
                type="checkbox"
                checked={profile.is_public || false}
                onChange={(e) => setProfile({ ...profile, is_public: e.target.checked })}
                className="h-5 w-5 rounded border-input text-primary focus:ring-ring"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-md bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 disabled:opacity-50"
            >
              {isSaving ? "Saving Changes..." : "Save Profile"}
            </button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
