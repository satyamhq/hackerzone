import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ProfileClient } from "./profile-client";

interface Props {
  params: { username: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", params.username)
    .single();

  const name = profile?.full_name || "Developer";
  return {
    title: `${name} — Verified AI Skills | Hackerzone`,
    description: `View ${name}'s verified skill profile on Hackerzone.`,
  };
}

export default async function PublicProfilePage({ params }: Props) {
  const supabase = await createClient();

  // Fetch profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name, avatar_url, role, created_at")
    .eq("id", params.username)
    .single();

  if (!profile) {
    notFound();
  }

  // Fetch student details if exists
  const { data: student } = await supabase
    .from("students")
    .select("headline, bio, skills, links, location, graduation_year, is_public")
    .eq("user_id", params.username)
    .single();

  // Respect privacy — if student profile is not public, show limited info
  const isPublic = student?.is_public !== false;

  // Fetch verified skills from user_skills
  const { data: userSkills } = await supabase
    .from("user_skills")
    .select("verified_score, badge_tier, verified_at, skills(name)")
    .eq("user_id", params.username)
    .not("verified_at", "is", null)
    .order("verified_score", { ascending: false });

  // Fetch submission history (passed only)
  const { data: submissions } = await supabase
    .from("submissions")
    .select("id, score, status, submitted_at, challenges(title, points, difficulty)")
    .eq("user_id", params.username)
    .eq("status", "passed")
    .order("submitted_at", { ascending: false })
    .limit(10);

  return (
    <ProfileClient
      profile={profile}
      student={isPublic ? student : null}
      userSkills={userSkills || []}
      submissions={isPublic ? submissions || [] : []}
      isPublic={isPublic}
    />
  );
}
