"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  ArrowRight,
  ArrowLeft,
  Landmark,
  Check,
  Loader2,
  Search,
} from "lucide-react";

type Step = 1 | 2 | 3;

interface FormData {
  full_name: string;
  job_title: string;
  phone: string;
  campus_id: string;
  new_campus_name: string;
  new_campus_domain: string;
  new_campus_city: string;
  new_campus_state: string;
}

interface Campus {
  id: string;
  name: string;
  city: string | null;
  state: string | null;
}

export default function CampusAdminOnboardingPage() {
  const router = useRouter();
  const supabase = createClient();
  const [step, setStep] = useState<Step>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [campuses, setCampuses] = useState<Campus[]>([]);
  const [campusSearch, setCampusSearch] = useState("");
  const [createNew, setCreateNew] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const [form, setForm] = useState<FormData>({
    full_name: "",
    job_title: "",
    phone: "",
    campus_id: "",
    new_campus_name: "",
    new_campus_domain: "",
    new_campus_city: "",
    new_campus_state: "",
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

      const { data } = await supabase
        .from("campuses")
        .select("id, name, city, state")
        .order("name");
      if (data) setCampuses(data);
    }
    init();
  }, []);

  const updateField = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const filteredCampuses = campuses.filter((c) =>
    c.name.toLowerCase().includes(campusSearch.toLowerCase())
  );

  const canProceed = (s: Step): boolean => {
    switch (s) {
      case 1:
        return form.full_name.trim().length >= 2;
      case 2:
        if (createNew) {
          return form.new_campus_name.trim().length >= 3;
        }
        return form.campus_id !== "";
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
          phone: form.phone.trim() || null,
          onboarding_completed: true,
        })
        .eq("id", userId);

      if (profileError) throw profileError;

      let targetCampusId = form.campus_id;

      // Create new campus if needed
      if (createNew && form.new_campus_name.trim()) {
        const slug = form.new_campus_name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "");

        const { data: newCampus, error: campusError } = await supabase
          .from("campuses")
          .insert({
            name: form.new_campus_name.trim(),
            slug,
            domain: form.new_campus_domain.trim() || null,
            city: form.new_campus_city.trim() || null,
            state: form.new_campus_state.trim() || null,
            is_verified: false,
          })
          .select("id")
          .single();

        if (campusError) throw campusError;
        if (newCampus) targetCampusId = newCampus.id;
      }

      // Create campus membership as admin
      if (targetCampusId) {
        await supabase.from("campus_members").insert({
          campus_id: targetCampusId,
          user_id: userId,
          role: "admin",
          is_approved: true,
        });
      }

      router.replace("/campus-admin/dashboard");
    } catch (err: any) {
      setError(err?.message || "Failed to save. Please try again.");
      setIsSubmitting(false);
    }
  };

  const stepLabels = ["You", "Campus", "Confirm"];

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center px-4 py-10 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1A1A1A] via-[#111111] to-[#0A0A0A] pointer-events-none" />

      <div className="w-full max-w-lg relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <Landmark className="w-6 h-6 text-white" />
            <span className="text-2xl font-bold italic tracking-tight text-white uppercase">
              Campus Setup
            </span>
          </div>
          <p className="text-sm text-[#A3A3A3]">
            Set up your career center to manage student placements.
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

          {/* Step 1: Admin Info */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white mb-1">Your Information</h2>
              <p className="text-xs text-[#A3A3A3] mb-4">
                We&apos;ll use this as your career center admin identity.
              </p>
              <InputField label="Full Name *" value={form.full_name} onChange={(v) => updateField("full_name", v)} placeholder="Dr. Anita Desai" />
              <InputField label="Title / Role" value={form.job_title} onChange={(v) => updateField("job_title", v)} placeholder="Director, Training & Placement Cell" />
              <InputField label="Phone" value={form.phone} onChange={(v) => updateField("phone", v)} placeholder="+91 98765 43210" />
            </div>
          )}

          {/* Step 2: Campus Selection */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white mb-1">Select Your Institution</h2>
              <p className="text-xs text-[#A3A3A3] mb-4">
                Choose your institution or register a new one.
              </p>

              {!createNew ? (
                <>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666]" />
                    <input
                      type="text"
                      value={campusSearch}
                      onChange={(e) => setCampusSearch(e.target.value)}
                      placeholder="Search institutions..."
                      className="w-full pl-9 pr-4 py-2.5 text-sm bg-[#1C1C1C] border border-[#3F3F3F] rounded-xl text-white placeholder-[#666] focus:outline-none focus:border-[#888] transition-colors"
                    />
                  </div>

                  <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
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
                  </div>

                  <button
                    type="button"
                    onClick={() => setCreateNew(true)}
                    className="w-full text-center text-xs text-[#A3A3A3] hover:text-white py-2 transition-colors"
                  >
                    Don&apos;t see your institution? Register it →
                  </button>
                </>
              ) : (
                <div className="space-y-3">
                  <InputField label="Institution Name *" value={form.new_campus_name} onChange={(v) => updateField("new_campus_name", v)} placeholder="National Institute of Technology, Trichy" />
                  <InputField label="Email Domain" value={form.new_campus_domain} onChange={(v) => updateField("new_campus_domain", v)} placeholder="nitt.edu" />
                  <div className="grid grid-cols-2 gap-3">
                    <InputField label="City" value={form.new_campus_city} onChange={(v) => updateField("new_campus_city", v)} placeholder="Tiruchirappalli" />
                    <InputField label="State" value={form.new_campus_state} onChange={(v) => updateField("new_campus_state", v)} placeholder="Tamil Nadu" />
                  </div>

                  <button
                    type="button"
                    onClick={() => setCreateNew(false)}
                    className="text-xs text-[#A3A3A3] hover:text-white transition-colors"
                  >
                    ← Back to search
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-white mb-1">Review & Confirm</h2>
              <p className="text-xs text-[#A3A3A3] mb-4">
                Verify your details before launching your campus admin console.
              </p>

              <div className="space-y-3">
                <ReviewItem label="Name" value={form.full_name} />
                {form.job_title && <ReviewItem label="Title" value={form.job_title} />}
                <ReviewItem
                  label="Institution"
                  value={
                    createNew
                      ? form.new_campus_name
                      : campuses.find((c) => c.id === form.campus_id)?.name || "—"
                  }
                />
                {createNew && (
                  <div className="p-3 bg-[#1C1C1C] border border-[#2D2D2D] rounded-xl">
                    <p className="text-xs text-[#666]">
                      New institutions require admin verification before students can join.
                      You&apos;ll be notified once approved.
                    </p>
                  </div>
                )}
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
                    <Loader2 className="w-4 h-4 animate-spin" /> Setting up...
                  </>
                ) : (
                  <>
                    Launch Console <ArrowRight className="w-4 h-4" />
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

function ReviewItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between p-3 bg-[#1C1C1C] border border-[#2D2D2D] rounded-xl">
      <span className="text-xs text-[#666]">{label}</span>
      <span className="text-sm text-white font-medium">{value}</span>
    </div>
  );
}
