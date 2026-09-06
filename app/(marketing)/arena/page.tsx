import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { ArenaClient } from "./arena-client";

export const metadata = {
  title: "Skill Arena — Prove Your AI Skills | Hackerzone",
  description:
    "Take skill challenges, earn verified badges, and prove your abilities to top employers across India.",
};

export default async function ArenaPage() {
  const supabase = await createClient();

  const { data: challenges } = await supabase
    .from("challenges")
    .select(
      "id, title, description, difficulty, points, is_published, skill_id, sponsor_company_id, skills(name), companies(name, logo_url)"
    )
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  const { data: skills } = await supabase
    .from("skills")
    .select("id, name, category")
    .order("name");

  return (
    <div className="flex min-h-screen flex-col bg-[#0A0A0A]">
      <Navbar />
      <main className="flex-1">
        <ArenaClient
          challenges={challenges || []}
          skills={skills || []}
        />
      </main>
      <Footer />
    </div>
  );
}
