import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { ChallengeDetailClient } from "./challenge-detail-client";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface Props {
  params: { challengeId: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = await createClient();
  const { data: challenge } = await supabase
    .from("challenges")
    .select("title")
    .eq("id", params.challengeId)
    .single();

  return {
    title: challenge
      ? `${challenge.title} — Skill Arena | Hackerzone`
      : "Challenge | Hackerzone",
  };
}

export default async function ChallengeDetailPage({ params }: Props) {
  const supabase = await createClient();

  const { data: challenge } = await supabase
    .from("challenges")
    .select(
      "id, title, description, difficulty, points, skill_id, sponsor_company_id, is_published, skills(name), companies(name, logo_url)"
    )
    .eq("id", params.challengeId)
    .eq("is_published", true)
    .single();

  if (!challenge) {
    notFound();
  }

  // Check if user has already submitted
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let existingSubmission = null;
  if (user) {
    const { data } = await supabase
      .from("submissions")
      .select("id, status, score, submitted_at")
      .eq("user_id", user.id)
      .eq("challenge_id", params.challengeId)
      .single();
    existingSubmission = data;
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#FAFBFC]">
      <Navbar />
      <main className="flex-1">
        <ChallengeDetailClient
          challenge={challenge}
          existingSubmission={existingSubmission}
          isAuthenticated={!!user}
        />
      </main>
      <Footer />
    </div>
  );
}
