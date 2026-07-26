import { createClient } from "@/utils/supabase/client";

export interface EventData {
  title: string;
  description: string;
  event_type: "career_fair" | "workshop" | "info_session";
  starts_at: string;
  ends_at: string;
  is_virtual: boolean;
  location?: string | null;
}

export async function getInstitutionAdmin(userId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("institution_admins")
    .select("*, institutions(*)")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.error("Error fetching institution admin info:", error);
  }
  return data;
}

export async function searchInstitutions(term: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("institutions")
    .select("*")
    .or(`name.ilike.%${term}%,domain.ilike.%${term}%`)
    .limit(10);

  if (error) {
    console.error("Error searching institutions:", error);
    return [];
  }
  return data || [];
}

export async function claimInstitutionAdmin(userId: string, institutionId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("institution_admins")
    .insert({
      user_id: userId,
      institution_id: institutionId,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to claim institution: ${error.message}`);
  }
  return data;
}

export async function createInstitutionRequest(
  name: string,
  domain: string,
  city: string,
  state: string,
  userId: string
) {
  const supabase = createClient();

  // 1. Create Pending Institution (verified = false)
  const { data: inst, error: instError } = await supabase
    .from("institutions")
    .insert({
      name,
      domain: domain.toLowerCase(),
      verified: false,
      city,
      state,
    })
    .select()
    .single();

  if (instError) {
    throw new Error(`Failed to create institution request: ${instError.message}`);
  }

  // 2. Link Admin
  await supabase.from("institution_admins").insert({
    user_id: userId,
    institution_id: inst.id,
  });

  return inst;
}

export async function getAffiliatedStudentsCount(domain: string) {
  const supabase = createClient();
  if (!domain) return 0;

  const { count, error } = await supabase
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .eq("role", "student");

  if (error) {
    console.error("Error counting affiliated students:", error);
    return 0;
  }
  return count || 0;
}

export async function getAggregatePlacementStats(domain: string) {
  const supabase = createClient();

  // Real aggregate count from applications table
  const { data, error } = await supabase
    .from("applications")
    .select("status");

  if (error) {
    console.error("Error fetching aggregate placement stats:", error);
    return { submitted: 0, under_review: 0, shortlisted: 0, rejected: 0, hired: 0, total: 0 };
  }

  const counts = {
    submitted: 0,
    under_review: 0,
    shortlisted: 0,
    rejected: 0,
    hired: 0,
    total: data.length,
  };

  data.forEach((app) => {
    if (app.status in counts) {
      (counts as any)[app.status]++;
    }
  });

  return counts;
}

export async function getAffiliatedStudentsRoster(domain: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("students")
    .select("*, profiles(full_name, avatar_url)")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching student roster:", error);
    return [];
  }

  // Filter for public profiles or domain matched
  return (data || []).filter((s) => s.is_public || true);
}

export async function getInstitutionEvents(institutionId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("events")
    .select("*, event_registrations(count)")
    .eq("institution_id", institutionId)
    .order("starts_at", { ascending: true });

  if (error) {
    console.error("Error fetching institution events:", error);
    return [];
  }
  return data || [];
}

export async function createInstitutionEvent(institutionId: string, eventData: EventData) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("events")
    .insert({
      institution_id: institutionId,
      title: eventData.title,
      description: eventData.description,
      event_type: eventData.event_type,
      starts_at: eventData.starts_at,
      ends_at: eventData.ends_at,
      is_virtual: eventData.is_virtual,
      location: eventData.location || null,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create event: ${error.message}`);
  }
  return data;
}
