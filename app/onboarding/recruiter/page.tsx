"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  ArrowRight,
  ArrowLeft,
  Building2,
  Check,
  Loader2,
} from "lucide-react";

type Step = 1 | 2 | 3;

interface FormData {
  full_name: string;
  company_name: string;
  company_slug: string;
  company_website: string;
  company_industry: string;
  company_size: string;
  company_headquarters: string;
  company_description: string;
  job_title: string;
}

export default function RecruiterOnboardingPage() {
  const router = useRouter();
  const supabase = createClient();
  const [step, setStep] = useState<Step>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const [form, setForm] = useState<FormData>({
    full_name: "",
    company_name: "",
    company_slug: "",
    company_website: "",
    company_industry: "",
    company_size: "",
    company_headquarters: "",
    company_description: "",
    job_title: "",
  });

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.replace("/login");
        return;
      }
      setUserId(user.id);
      const meta = user.user_metadata;
      setForm((prev) => ({
        ...prev,
        full_name: meta?.full_name || meta?.name || "",
      }));
    }
    init();
  }, []);

  const updateField = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (field === "company_name") {
      setForm((prev) => ({
        ...prev,
        company_slug: value
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, ""),
      }));
    }
  };

  const canProceed = (s: Step): boolean => {
    switch (s) {
      case 1:
        return form.full_name.trim().length >= 2;
      case 2:
        return form.company_name.trim().length >= 2 && form.company_slug.trim().length >= 2;
      case 3:
        return true;
    }
  };

  const handleSubmit = async () => {
    if (!userId) return;
    setIsSubmitting(true);
    setError(null);

    try {
      // Update profile
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          full_name: form.full_name.trim(),
          headline: form.job_title.trim() || null,
          onboarding_completed: true,
        })
        .eq("id", userId);

      if (profileError) throw profileError;

      // Create company
      const { data: company, error: companyError } = await supabase
        .from("companies")
        .insert({
          name: form.company_name.trim(),
          slug: form.company_slug.trim(),
          website_url: form.company_website.trim() || null,
          industry: form.company_industry.trim() || null,
          company_size: form.company_size || null,
          headquarters: form.company_headquarters.trim() || null,
          description: form.company_description.trim() || null,
        })
        .select("id")
        .single();

      if (companyError) throw companyError;

      // Add user as company admin
      if (company) {
        await supabase.from("company_members").insert({
          company_id: company.id,
          user_id: userId,
          role: "admin",
          is_approved: true,
        });
      }

      router.replace("/company/dashboard");
    } catch (err: any) {
      setError(err?.message || "Failed to save. Please try again.");
      setIsSubmitting(false);
    }
  };

  const stepLabels = ["You", "Company", "Details"];
  const sizeOptions = ["1-10", "11-50", "50-100", "100-250", "250-500", "500-1000", "1000+"];

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center px-4 py-10 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1A1A1A] via-[#111111] to-[#0A0A0A] pointer-events-none" />

      <div className="w-full max-w-lg relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <Building2 className="w-6 h-6 text-white" />
            <span className="text-2xl font-bold italic tracking-tight text-white uppercase">
              Employer Setup
            </span>
          </div>
          <p className="text-sm text-[#A3A3A3]">
            Set up your company profile to start hiring verified AI talent.
          </p>
        </div>

        {/* Progress */}
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
              style={{ width: `${((step - 1) / 2) * 100}%` }}
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

          {/* Step 1: Your Info */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white mb-1">Your Information</h2>
              <p className="text-xs text-[#A3A3A3] mb-4">We&apos;ll use this to identify you within your company team.</p>
              <InputField label="Full Name *" value={form.full_name} onChange={(v) => updateField("full_name", v)} placeholder="Rahul Mehta" />
              <InputField label="Job Title" value={form.job_title} onChange={(v) => updateField("job_title", v)} placeholder="Head of Talent · Sarvam AI" />
            </div>
          )}

          {/* Step 2: Company Basics */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white mb-1">Company Profile</h2>
              <p className="text-xs text-[#A3A3A3] mb-4">This creates your public company page on Hackerzone.</p>
              <InputField label="Company Name *" value={form.company_name} onChange={(v) => updateField("company_name", v)} placeholder="Sarvam AI" />
              <InputField label="URL Slug *" value={form.company_slug} onChange={(v) => updateField("company_slug", v)} placeholder="sarvam-ai" />
              <InputField label="Website" value={form.company_website} onChange={(v) => updateField("company_website", v)} placeholder="https://sarvam.ai" />
              <InputField label="Industry" value={form.company_industry} onChange={(v) => updateField("company_industry", v)} placeholder="Generative AI & LLMs" />
            </div>
          )}

          {/* Step 3: Details */}
          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white mb-1">Company Details</h2>
              <p className="text-xs text-[#A3A3A3] mb-4">Help candidates learn more about your company.</p>

              <div>
                <label className="block text-xs text-[#666] font-medium mb-1">Company Size</label>
                <div className="flex flex-wrap gap-2">
                  {sizeOptions.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => updateField("company_size", size)}
                      className={`px-3 py-1.5 text-xs rounded-full border transition-all ${
                        form.company_size === size
                          ? "bg-white text-black border-white font-semibold"
                          : "bg-transparent text-[#A3A3A3] border-[#3F3F3F] hover:border-[#666] hover:text-white"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <InputField label="Headquarters" value={form.company_headquarters} onChange={(v) => updateField("company_headquarters", v)} placeholder="Bengaluru, India" />

              <div>
                <label className="block text-xs text-[#666] font-medium mb-1">Company Description</label>
                <textarea
                  value={form.company_description}
                  onChange={(e) => updateField("company_description", e.target.value)}
                  placeholder="What does your company do? What's your mission?"
                  rows={4}
                  className="w-full px-3 py-2 text-sm bg-[#1C1C1C] border border-[#3F3F3F] rounded-xl text-white placeholder-[#555] focus:outline-none focus:border-[#888] transition-colors resize-none"
                />
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

            {step < 3 ? (
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
                    <Loader2 className="w-4 h-4 animate-spin" /> Creating...
                  </>
                ) : (
                  <>
                    Launch Company <ArrowRight className="w-4 h-4" />
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

function InputField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs text-[#666] font-medium mb-1">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 text-sm bg-[#1C1C1C] border border-[#3F3F3F] rounded-xl text-white placeholder-[#555] focus:outline-none focus:border-[#888] transition-colors"
      />
    </div>
  );
}
