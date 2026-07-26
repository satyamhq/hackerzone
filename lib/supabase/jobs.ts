import { createClient } from "@/utils/supabase/client";

export interface JobSearchParams {
  query?: string;
  job_type?: string;
  location?: string;
  is_remote?: boolean;
  skills?: string[];
  page?: number;
  pageSize?: number;
}

export async function searchJobs(params: JobSearchParams) {
  const supabase = createClient();
  const page = params.page || 1;
  const pageSize = params.pageSize || 10;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("jobs")
    .select("*, companies(name, logo_url, website, verified)", { count: "exact" })
    .eq("status", "open");

  // Postgres Full-Text Search on GIN-indexed fts column
  if (params.query && params.query.trim().length > 0) {
    const formattedQuery = params.query.trim().split(/\s+/).join(" & ");
    query = query.textSearch("fts", formattedQuery, { config: "english" });
  }

  if (params.job_type && params.job_type !== "all") {
    query = query.eq("job_type", params.job_type);
  }

  if (params.location && params.location.trim().length > 0) {
    query = query.ilike("location", `%${params.location.trim()}%`);
  }

  if (params.is_remote !== undefined && params.is_remote) {
    query = query.eq("is_remote", true);
  }

  if (params.skills && params.skills.length > 0) {
    query = query.overlaps("skills_required", params.skills);
  }

  query = query.order("created_at", { ascending: false }).range(from, to);

  const { data, count, error } = await query;

  if (error) {
    console.error("Error performing full-text job search:", error);
    return { data: [], count: 0 };
  }

  return { data: data || [], count: count || 0 };
}

export async function getJobDetails(jobId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("jobs")
    .select("*, companies(*)")
    .eq("id", jobId)
    .single();

  if (error) {
    console.error("Error fetching job details:", error);
    return null;
  }
  return data;
}

export async function getSimilarJobs(jobId: string, skills: string[]) {
  const supabase = createClient();
  if (!skills || skills.length === 0) return [];

  const { data, error } = await supabase
    .from("jobs")
    .select("*, companies(name, logo_url)")
    .eq("status", "open")
    .neq("id", jobId)
    .overlaps("skills_required", skills)
    .limit(4);

  if (error) {
    console.error("Error fetching similar jobs:", error);
    return [];
  }
  return data || [];
}

export async function saveSearchFilter(userId: string, name: string, filters: Record<string, any>) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("saved_searches")
    .insert({
      user_id: userId,
      name,
      filters,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }
  return data;
}

export async function getUserSavedSearches(userId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("saved_searches")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching saved searches:", error);
    return [];
  }
  return data || [];
}

export async function submitJobApplication(
  jobId: string,
  studentId: string,
  resumeUrl: string | null,
  coverLetter: string
) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("applications")
    .insert({
      job_id: jobId,
      student_id: studentId,
      status: "submitted",
      resume_url: resumeUrl,
      cover_letter: coverLetter,
    })
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      throw new Error("You have already applied for this job position.");
    }
    throw new Error(error.message);
  }
  return data;
}
