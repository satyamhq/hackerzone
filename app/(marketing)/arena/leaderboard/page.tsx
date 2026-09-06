import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { LeaderboardClient } from "./leaderboard-client";

export const metadata = {
  title: "Leaderboard — Skill Arena | Hackerzone",
  description: "See top performers across Hackerzone Skill Arena challenges.",
};

export default async function LeaderboardPage() {
  const supabase = await createClient();

  // Aggregate top scorers: sum of scores from passed submissions grouped by user
  const { data: leaders } = await supabase
    .rpc("get_leaderboard", {})
    .limit(50);

  const { data: skills } = await supabase
    .from("skills")
    .select("id, name")
    .order("name");

  return (
    <div className="flex min-h-screen flex-col bg-[#FAFBFC]">
      <Navbar />
      <main className="flex-1">
        <LeaderboardClient leaders={leaders || []} skills={skills || []} />
      </main>
      <Footer />
    </div>
  );
}
