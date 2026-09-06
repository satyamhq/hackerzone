import { createClient } from "@/lib/supabase/client";
import { PRICING_TIERS } from "@/lib/pricing";

export interface CompanyData {
  id?: string;
  name: string;
  website?: string | null;
  industry: string;
  size_range: string;
  description: string;
  logo_url?: string | null;
}

export interface JobData {
  title: string;
  description: string;
  job_type: "full_time" | "internship" | "part_time" | "freelance" | "gig";
  location: string;
  is_remote: boolean;
  min_salary?: number | null;
  max_salary?: number | null;
  skills_required: string[];
  status: "draft" | "open" | "closed";
}

export async function getEmployerCompany(userId: string) {
  const supabase = createClient();
  const { data: member, error } = await supabase
    .from("employer_members")
    .select("*, companies(*), employer_plans:companies(employer_plans(*))")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.error("Error fetching employer company:", error);
  }
  return member;
}

export async function searchCompanies(searchTerm: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("companies")
    .select("id, name, industry, website, logo_url")
    .ilike("name", `%${searchTerm}%`)
    .limit(10);

  if (error) {
    console.error("Error searching companies:", error);
    return [];
  }
  return data || [];
}

export async function createCompany(userId: string, companyData: CompanyData) {
  const supabase = createClient();

  // 1. Insert Company
  const { data: company, error: companyError } = await supabase
    .from("companies")
    .insert({
      name: companyData.name,
      website: companyData.website || null,
      industry: companyData.industry,
      size_range: companyData.size_range,
      description: companyData.description,
      verified: true,
    })
    .select()
    .single();

  if (companyError) {
    throw new Error(`Failed to create company: ${companyError.message}`);
  }

  // 2. Insert Employer Member (Owner)
  const { error: memberError } = await supabase.from("employer_members").insert({
    user_id: userId,
    company_id: company.id,
    role: "owner",
  });

  if (memberError) {
    throw new Error(`Failed to link employer member: ${memberError.message}`);
  }

  // 3. Initialize Employer Plan (Basic tier quota from PRICING_TIERS)
  await supabase.from("employer_plans").insert({
    company_id: company.id,
    plan: "basic",
    message_quota: PRICING_TIERS.basic.messageQuota,
  });

  return company;
}

export async function joinCompany(userId: string, companyId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("employer_members")
    .insert({
      user_id: userId,
      company_id: companyId,
      role: "recruiter",
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to join company: ${error.message}`);
  }
  return data;
}

export async function createJob(userId: string, companyId: string, jobData: JobData) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("jobs")
    .insert({
      company_id: companyId,
      posted_by: userId,
      title: jobData.title,
      description: jobData.description,
      job_type: jobData.job_type,
      location: jobData.location,
      is_remote: jobData.is_remote,
      min_salary: jobData.min_salary || null,
      max_salary: jobData.max_salary || null,
      skills_required: jobData.skills_required,
      status: jobData.status,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to post job: ${error.message}`);
  }
  return data;
}

export async function getCompanyJobs(companyId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("jobs")
    .select("*, applications(count)")
    .eq("company_id", companyId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching company jobs:", error);
    return [];
  }
  return data || [];
}

export async function updateJobStatus(jobId: string, newStatus: "draft" | "open" | "closed") {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("jobs")
    .update({ status: newStatus, updated_at: new Date().toISOString() })
    .eq("id", jobId)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }
  return data;
}

export async function getJobApplicants(jobId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("applications")
    .select("*, students(*, profiles(full_name, avatar_url, phone))")
    .eq("job_id", jobId)
    .order("applied_at", { ascending: false });

  if (error) {
    console.error("Error fetching applicants:", error);
    return [];
  }
  return data || [];
}

export async function updateApplicationStatus(
  applicationId: string,
  studentUserId: string,
  newStatus: "submitted" | "under_review" | "shortlisted" | "rejected" | "hired",
  jobTitle: string
) {
  const supabase = createClient();

  // 1. Update application status
  const { data: updatedApp, error: appError } = await supabase
    .from("applications")
    .update({ status: newStatus, updated_at: new Date().toISOString() })
    .eq("id", applicationId)
    .select()
    .single();

  if (appError) {
    throw new Error(`Failed to update application status: ${appError.message}`);
  }

  // 2. Insert Notification for the student
  if (studentUserId) {
    await supabase.from("notifications").insert({
      user_id: studentUserId,
      type: "application_status_change",
      payload: {
        application_id: applicationId,
        job_title: jobTitle,
        status: newStatus,
        message: `Your application for "${jobTitle}" has been updated to ${newStatus.replace("_", " ")}.`,
      },
    });
  }

  return updatedApp;
}

export async function checkAndDeductMessageQuota(companyId: string) {
  const supabase = createClient();

  const { data: plan, error } = await supabase
    .from("employer_plans")
    .select("*")
    .eq("company_id", companyId)
    .single();

  if (error || !plan) {
    return { allowed: false, message: "Employer plan not found." };
  }

  if (plan.message_quota <= 0) {
    return {
      allowed: false,
      message: `Outbound message quota exceeded! Please upgrade to Pro for ${PRICING_TIERS.pro.messageQuota} monthly messages.`,
    };
  }

  // Deduct 1 quota
  const newQuota = plan.message_quota - 1;
  await supabase
    .from("employer_plans")
    .update({ message_quota: newQuota })
    .eq("id", plan.id);

  return { allowed: true, quotaRemaining: newQuota };
}
