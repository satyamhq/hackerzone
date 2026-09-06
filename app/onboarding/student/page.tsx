"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { SKILL_CATEGORIES } from "@/lib/constants/skillTaxonomy";
import {
  ArrowRight,
  ArrowLeft,
  GraduationCap,
  Sparkles,
  Shield,
  Check,
  Loader2,
  Search,
} from "lucide-react";

type Step = 1 | 2 | 3 | 4;

interface FormData {
  full_name: string;
  username: string;
  headline: string;
  bio: string;
  location: string;
  degree: string;
  major: string;
  graduation_year: string;
  gpa: string;
  github_url: string;
  linkedin_url: string;
  portfolio_url: string;
  selected_skills: string[];
  campus_id: string;
  visibility: "public" | "anonymous";
  gpa_visible: boolean;
}

interface Campus {
  id: string;
  name: string;
  city: string | null;
  state: string | null;
}

export default function StudentOnboardingPage() {
  const router = useRouter();
  const supabase = createClient();
  const [step, setStep] = useState<Step>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [campuses, setCampuses] = useState<Campus[]>([]);
  const [campusSearch, setCampusSearch] = useState("");
  const [userId, setUserId] = useState<string | null>(null);

  const [form, setForm] = useState<FormData>({
    full_name: "",
    username: "",
    headline: "",
    bio: "",
    location: "",
    degree: "",
    major: "",
    graduation_year: "",
    gpa: "",
    github_url: "",
    linkedin_url: "",
    portfolio_url: "",
    selected_skills: [],
    campus_id: "",
    visibility: "public",
    gpa_visible: false,
  });

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.replace("/login");
        return;
      }
      setUserId(user.id);

      // Pre-fill from Google profile
      const meta = user.user_metadata;
      setForm((prev) => ({
        ...prev,
        full_name: meta?.full_name || meta?.name || "",
      }));

      // Fetch campuses
      const { data } = await supabase
        .from("campuses")
        .select("id, name, city, state")
        .order("name");
      if (data) setCampuses(data);
    }
    init();
  }, []);

  const updateField = (field: keyof FormData, value: string | boolean | string[]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggleSkill = (skill: string) => {
    setForm((prev) => ({
      ...prev,
      selected_skills: prev.selected_skills.includes(skill)
        ? prev.selected_skills.filter((s) => s !== skill)
        : [...prev.selected_skills, skill],
    }));
  };

  const filteredCampuses = campuses.filter((c) =>
    c.name.toLowerCase().includes(campusSearch.toLowerCase())
  );

  const canProceed = (s: Step): boolean => {
    switch (s) {
      case 1:
        return form.full_name.trim().length >= 2 && form.username.trim().length >= 3;
      case 2:
        return form.selected_skills.length >= 1;
      case 3:
        return true; // campus optional
      case 4:
        return true;
    }
  };

  const handleSubmit = async () => {
    if (!userId) return;
    setIsSubmitting(true);
    setError(null);

    try {
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          full_name: form.full_name.trim(),
          username: form.username.trim().toLowerCase().replace(/[^a-z0-9_-]/g, ""),
          headline: form.headline.trim() || null,
          bio: form.bio.trim() || null,
          location: form.location.trim() || null,
          degree: form.degree.trim() || null,
          major: form.major.trim() || null,
          graduation_year: form.graduation_year ? parseInt(form.graduation_year) : null,
          gpa: form.gpa ? parseFloat(form.gpa) : null,
          github_url: form.github_url.trim() || null,
          linkedin_url: form.linkedin_url.trim() || null,
          portfolio_url: form.portfolio_url.trim() || null,
          visibility: form.visibility,
          gpa_visible: form.gpa_visible,
          onboarding_completed: true,
        })
        .eq("id", userId);

      if (profileError) throw profileError;

      // Create campus membership if selected
      if (form.campus_id) {
        await supabase.from("campus_members").insert({
          campus_id: form.campus_id,
          user_id: userId,
          role: "student",
        });
      }

      router.replace("/dashboard");
    } catch (err: any) {
      setError(err?.message || "Failed to save profile. Please try again.");
      setIsSubmitting(false);
    }
  };

  const stepLabels = ["Profile", "Skills", "Campus", "Privacy"];

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center px-4 py-10 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1A1A1A] via-[#111111] to-[#0A0A0A] pointer-events-none" />

      <div className="w-full max-w-lg relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <GraduationCap className="w-6 h-6 text-white" />
            <span className="text-2xl font-bold italic tracking-tight text-white uppercase">
              Student Setup
            </span>
          </div>
          <p className="text-sm text-[#A3A3A3]">
            Build your verified AI skill profile in a few steps.
          </p>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {stepLabels.map((label, i) => (
              <div key={label} className="flex flex-col items-center flex-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    i + 1 < step
                      ? "bg-white text-black"
                      : i + 1 === step
                      ? "bg-white text-black ring-2 ring-white/30 ring-offset-2 ring-offset-[#0A0A0A]"
                      : "bg-[#1C1C1C] text-[#A3A3A3] border border-[#3F3F3F]"
                  }`}
                >
                  {i + 1 < step ? <Check className="w-4 h-4" /> : i + 1}
                </div>
                <span className={`text-[10px] mt-1.5 ${i + 1 <= step ? "text-white" : "text-[#666]"}`}>
                  {label}
                </span>
              </div>
            ))}
          </div>
          <div className="h-1 bg-[#1C1C1C] rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-500"
              style={{ width: `${((step - 1) / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Card */}
        <div className="bg-[#141414] border border-[#3F3F3F] rounded-2xl p-6 sm:p-8 shadow-2xl">
          {error && (
            <div className="mb-4 p-3 bg-red-950/40 border border-red-800/60 rounded-xl text-xs text-red-300">
              {error}
            </div>
          )}

          {/* Step 1: Profile & Education */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white mb-1">Profile & Education</h2>
              <p className="text-xs text-[#A3A3A3] mb-4">Tell us about yourself and your academic background.</p>

              <div className="grid grid-cols-2 gap-3">
                <InputField label="Full Name *" value={form.full_name} onChange={(v) => updateField("full_name", v)} placeholder="Priya Sharma" />
                <InputField label="Username *" value={form.username} onChange={(v) => updateField("username", v)} placeholder="priyasharma" />
              </div>
              <InputField label="Headline" value={form.headline} onChange={(v) => updateField("headline", v)} placeholder="AI Engineer · IIT Delhi '26" />
              <TextareaField label="Bio" value={form.bio} onChange={(v) => updateField("bio", v)} placeholder="Brief intro about your interests and goals..." rows={3} />
              <InputField label="Location" value={form.location} onChange={(v) => updateField("location", v)} placeholder="New Delhi, India" />

              <div className="border-t border-[#2A2A2A] pt-4 mt-4">
                <p className="text-xs text-[#666] uppercase tracking-wider font-semibold mb-3">Education</p>
                <div className="grid grid-cols-2 gap-3">
                  <InputField label="Degree" value={form.degree} onChange={(v) => updateField("degree", v)} placeholder="B.Tech" />
                  <InputField label="Major" value={form.major} onChange={(v) => updateField("major", v)} placeholder="Computer Science" />
                  <InputField label="Graduation Year" value={form.graduation_year} onChange={(v) => updateField("graduation_year", v)} placeholder="2026" type="number" />
                  <InputField label="GPA" value={form.gpa} onChange={(v) => updateField("gpa", v)} placeholder="8.5" type="number" />
                </div>
              </div>

              <div className="border-t border-[#2A2A2A] pt-4 mt-4">
                <p className="text-xs text-[#666] uppercase tracking-wider font-semibold mb-3">Links</p>
                <div className="space-y-3">
                  <InputField label="GitHub" value={form.github_url} onChange={(v) => updateField("github_url", v)} placeholder="https://github.com/..." />
                  <InputField label="LinkedIn" value={form.linkedin_url} onChange={(v) => updateField("linkedin_url", v)} placeholder="https://linkedin.com/in/..." />
                  <InputField label="Portfolio" value={form.portfolio_url} onChange={(v) => updateField("portfolio_url", v)} placeholder="https://..." />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Skills */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white mb-1">Select Your Skills</h2>
              <p className="text-xs text-[#A3A3A3] mb-4">
                Pick the AI skills you want on your profile. You&apos;ll verify them later in the Skill Arena.
              </p>
              <div className="space-y-5 max-h-[420px] overflow-y-auto pr-1">
                {SKILL_CATEGORIES.map((cat) => (
                  <div key={cat.name}>
                    <p className="text-xs text-[#666] uppercase tracking-wider font-semibold mb-2">
                      {cat.name}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {cat.skills.map((skill) => {
                        const selected = form.selected_skills.includes(skill);
                        return (
                          <button
                            key={skill}
                            type="button"
                            onClick={() => toggleSkill(skill)}
                            className={`px-3 py-1.5 text-xs rounded-full border transition-all ${
                              selected
                                ? "bg-white text-black border-white font-semibold"
                                : "bg-transparent text-[#A3A3A3] border-[#3F3F3F] hover:border-[#666] hover:text-white"
                            }`}
                          >
                            {selected && <Check className="w-3 h-3 inline mr-1" />}
                            {skill}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-[#666] mt-2">
                {form.selected_skills.length} skill{form.selected_skills.length !== 1 ? "s" : ""} selected
              </p>
            </div>
          )}

          {/* Step 3: Campus */}
          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white mb-1">Join Your Campus</h2>
              <p className="text-xs text-[#A3A3A3] mb-4">
                Link your college to access campus-specific jobs, events, and placement tools. This is optional.
              </p>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666]" />
                <input
                  type="text"
                  value={campusSearch}
                  onChange={(e) => setCampusSearch(e.target.value)}
                  placeholder="Search for your college..."
                  className="w-full pl-9 pr-4 py-2.5 text-sm bg-[#1C1C1C] border border-[#3F3F3F] rounded-xl text-white placeholder-[#666] focus:outline-none focus:border-[#888] transition-colors"
                />
              </div>

              <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
                {/* No campus option */}
                <button
                  type="button"
                  onClick={() => updateField("campus_id", "")}
                  className={`w-full text-left p-3 rounded-xl border transition-all ${
                    form.campus_id === ""
                      ? "bg-white/5 border-white/30 text-white"
                      : "bg-[#1C1C1C] border-[#2D2D2D] text-[#A3A3A3] hover:border-[#666]"
                  }`}
                >
                  <span className="text-sm">Skip — I&apos;ll add my campus later</span>
                </button>

                {filteredCampuses.map((campus) => (
                  <button
                    key={campus.id}
                    type="button"
                    onClick={() => updateField("campus_id", campus.id)}
                    className={`w-full text-left p-3 rounded-xl border transition-all ${
                      form.campus_id === campus.id
                        ? "bg-white/5 border-white/30 text-white"
                        : "bg-[#1C1C1C] border-[#2D2D2D] text-[#A3A3A3] hover:border-[#666]"
                    }`}
                  >
                    <span className="text-sm font-medium">{campus.name}</span>
                    {(campus.city || campus.state) && (
                      <span className="text-xs text-[#666] ml-2">
                        {[campus.city, campus.state].filter(Boolean).join(", ")}
                      </span>
                    )}
                  </button>
                ))}

                {filteredCampuses.length === 0 && campusSearch && (
                  <p className="text-xs text-[#666] text-center py-4">
                    No campuses found. You can request yours after onboarding.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Step 4: Privacy */}
          {step === 4 && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-white mb-1">Privacy Settings</h2>
              <p className="text-xs text-[#A3A3A3] mb-4">
                Control who can discover your profile. You can change these anytime in Settings.
              </p>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => updateField("visibility", "public")}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    form.visibility === "public"
                      ? "bg-white/5 border-white/30"
                      : "bg-[#1C1C1C] border-[#2D2D2D] hover:border-[#666]"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Sparkles className={`w-5 h-5 mt-0.5 ${form.visibility === "public" ? "text-white" : "text-[#666]"}`} />
                    <div>
                      <p className={`text-sm font-semibold ${form.visibility === "public" ? "text-white" : "text-[#A3A3A3]"}`}>
                        Public Profile
                      </p>
                      <p className="text-xs text-[#666] mt-0.5">
                        Employers can discover you in talent search. Your verified skills, headline, and bio are visible.
                      </p>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => updateField("visibility", "anonymous")}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    form.visibility === "anonymous"
                      ? "bg-white/5 border-white/30"
                      : "bg-[#1C1C1C] border-[#2D2D2D] hover:border-[#666]"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Shield className={`w-5 h-5 mt-0.5 ${form.visibility === "anonymous" ? "text-white" : "text-[#666]"}`} />
                    <div>
                      <p className={`text-sm font-semibold ${form.visibility === "anonymous" ? "text-white" : "text-[#A3A3A3]"}`}>
                        Anonymous
                      </p>
                      <p className="text-xs text-[#666] mt-0.5">
                        Browse and apply privately. Employers can&apos;t find you in search — you control who sees your profile.
                      </p>
                    </div>
                  </div>
                </button>
              </div>

              <div className="border-t border-[#2A2A2A] pt-4">
                <label className="flex items-center justify-between p-3 bg-[#1C1C1C] border border-[#2D2D2D] rounded-xl cursor-pointer">
                  <div>
                    <p className="text-sm text-[#A3A3A3] font-medium">Show GPA on profile</p>
                    <p className="text-xs text-[#666] mt-0.5">Visible only when profile is public</p>
                  </div>
                  <div
                    onClick={() => updateField("gpa_visible", !form.gpa_visible)}
                    className={`w-10 h-6 rounded-full flex items-center transition-colors cursor-pointer ${
                      form.gpa_visible ? "bg-white justify-end" : "bg-[#3F3F3F] justify-start"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full mx-1 transition-colors ${
                        form.gpa_visible ? "bg-black" : "bg-[#666]"
                      }`}
                    />
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-5 border-t border-[#2A2A2A]">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((step - 1) as Step)}
                className="flex items-center gap-1.5 text-sm text-[#A3A3A3] hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            ) : (
              <div />
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={() => setStep((step + 1) as Step)}
                disabled={!canProceed(step)}
                className="flex items-center gap-1.5 px-5 py-2.5 text-sm font-semibold rounded-full bg-white text-black hover:bg-[#E5E5E5] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-1.5 px-6 py-2.5 text-sm font-semibold rounded-full bg-white text-black hover:bg-[#E5E5E5] disabled:opacity-50 transition-all"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    Launch Profile <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Shared input components ── */

function InputField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-xs text-[#666] font-medium mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 text-sm bg-[#1C1C1C] border border-[#3F3F3F] rounded-xl text-white placeholder-[#555] focus:outline-none focus:border-[#888] transition-colors"
      />
    </div>
  );
}

function TextareaField({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <div>
      <label className="block text-xs text-[#666] font-medium mb-1">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full px-3 py-2 text-sm bg-[#1C1C1C] border border-[#3F3F3F] rounded-xl text-white placeholder-[#555] focus:outline-none focus:border-[#888] transition-colors resize-none"
      />
    </div>
  );
}
