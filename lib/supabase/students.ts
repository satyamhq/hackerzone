import { createClient } from "@/utils/supabase/client";

export interface StudentProfileData {
  id?: string;
  user_id: string;
  headline: string | null;
  bio: string | null;
  resume_url: string | null;
  graduation_year: number | null;
  location: string | null;
  skills: string[];
  links: Record<string, string>;
  is_public: boolean;
}

export function calculateProfileCompleteness(profile: Partial<StudentProfileData> | null): number {
  if (!profile) return 0;
  let score = 0;
  const totalWeight = 6;

  if (profile.headline && profile.headline.trim().length > 0) score++;
  if (profile.bio && profile.bio.trim().length > 0) score++;
  if (profile.resume_url) score++;
  if (profile.graduation_year) score++;
  if (profile.location && profile.location.trim().length > 0) score++;
  if (profile.skills && profile.skills.length > 0) score++;

  return Math.round((score / totalWeight) * 100);
}

export async function getStudentProfile(userId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("students")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.error("Error fetching student profile:", error);
  }
  return data as StudentProfileData | null;
}

export async function upsertStudentProfile(userId: string, profileData: Partial<StudentProfileData>) {
  const supabase = createClient();
  
  const payload = {
    user_id: userId,
    headline: profileData.headline ?? null,
    bio: profileData.bio ?? null,
    graduation_year: profileData.graduation_year ? Number(profileData.graduation_year) : null,
    location: profileData.location ?? null,
    skills: profileData.skills ?? [],
    links: profileData.links ?? {},
    is_public: profileData.is_public ?? false,
    resume_url: profileData.resume_url ?? null,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("students")
    .upsert(payload, { onConflict: "user_id" })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function uploadResume(userId: string, file: File): Promise<string> {
  const supabase = createClient();
  const filePath = `${userId}/resume_${Date.now()}.pdf`;

  const { error: uploadError } = await supabase.storage
    .from("resumes")
    .upload(filePath, file, { upsert: true });

  if (uploadError) {
    throw new Error(`Resume upload failed: ${uploadError.message}`);
  }

  return filePath;
}

export async function getSignedResumeUrl(filePath: string): Promise<string | null> {
  if (!filePath) return null;
  const supabase = createClient();
  const { data, error } = await supabase.storage
    .from("resumes")
    .createSignedUrl(filePath, 3600); // 1 hour expiration

  if (error) {
    console.error("Error generating signed URL:", error);
    return null;
  }
  return data.signedUrl;
}

export async function getRecommendedJobs(skills: string[]) {
  const supabase = createClient();
  
  let query = supabase
    .from("jobs")
    .select("*, companies(name, logo_url, website)")
    .eq("status", "open")
    .order("created_at", { ascending: false })
    .limit(10);

  if (skills && skills.length > 0) {
    query = query.overlaps("skills_required", skills);
  }

  const { data, error } = await query;
  if (error) {
    console.error("Error fetching recommended jobs:", error);
    return [];
  }
  return data || [];
}

export async function getStudentApplications(studentId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("applications")
    .select("*, jobs(title, location, job_type, companies(name, logo_url))")
    .eq("student_id", studentId)
    .order("applied_at", { ascending: false });

  if (error) {
    console.error("Error fetching applications:", error);
    return [];
  }
  return data || [];
}

export async function getStudentEvents(userId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("event_registrations")
    .select("*, events(*, institutions(name), companies(name))")
    .eq("user_id", userId)
    .order("registered_at", { ascending: false });

  if (error) {
    console.error("Error fetching registered events:", error);
    return [];
  }
  return data || [];
}
