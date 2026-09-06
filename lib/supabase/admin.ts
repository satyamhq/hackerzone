import { createClient } from "@/lib/supabase/client";

export async function getAdminPlatformMetrics() {
  const supabase = createClient();

  const [
    { count: studentCount },
    { count: employerCount },
    { count: institutionAdminCount },
    { count: totalJobsCount },
    { count: totalAppsCount },
    { data: plans },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "student"),
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "employer"),
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "institution_admin"),
    supabase.from("jobs").select("*", { count: "exact", head: true }),
    supabase.from("applications").select("*", { count: "exact", head: true }),
    supabase.from("employer_plans").select("plan"),
  ]);

  const planBreakdown = {
    basic: (plans || []).filter((p) => p.plan === "basic").length,
    pro: (plans || []).filter((p) => p.plan === "pro").length,
    enterprise: (plans || []).filter((p) => p.plan === "enterprise").length,
  };

  return {
    students: studentCount || 0,
    employers: employerCount || 0,
    institutionAdmins: institutionAdminCount || 0,
    totalJobs: totalJobsCount || 0,
    totalApplications: totalAppsCount || 0,
    plans: planBreakdown,
  };
}

export async function getPendingInstitutions() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("institutions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching institutions:", error);
    return [];
  }
  return data || [];
}

export async function verifyInstitution(id: string, verified: boolean) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("institutions")
    .update({ verified })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update institution verification: ${error.message}`);
  }
  return data;
}

export async function getPendingCompanies() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("companies")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching companies:", error);
    return [];
  }
  return data || [];
}

export async function verifyCompany(id: string, verified: boolean) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("companies")
    .update({ verified })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update company verification: ${error.message}`);
  }
  return data;
}

export async function getJobReports() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("job_reports")
    .select("*, jobs(title, company_id, companies(name)), profiles!job_reports_reported_by_fkey(full_name)")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching job reports:", error);
    return [];
  }
  return data || [];
}

export async function unpublishJob(jobId: string, reportId: string) {
  const supabase = createClient();

  // 1. Close job
  await supabase
    .from("jobs")
    .update({ status: "closed" })
    .eq("id", jobId);

  // 2. Resolve report
  if (reportId) {
    await supabase
      .from("job_reports")
      .update({ status: "resolved" })
      .eq("id", reportId);
  }
}

export async function searchAdminUsers(term: string) {
  const supabase = createClient();
  let query = supabase.from("profiles").select("*").order("created_at", { ascending: false });

  if (term && term.trim().length > 0) {
    query = query.ilike("full_name", `%${term.trim()}%`);
  }

  const { data, error } = await query.limit(20);
  if (error) {
    console.error("Error searching admin users:", error);
    return [];
  }
  return data || [];
}

export async function toggleUserDeactivation(userId: string, deactivate: boolean) {
  const supabase = createClient();
  const deactivatedAt = deactivate ? new Date().toISOString() : null;

  const { data, error } = await supabase
    .from("profiles")
    .update({ deactivated_at: deactivatedAt })
    .eq("id", userId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update user status: ${error.message}`);
  }
  return data;
}
