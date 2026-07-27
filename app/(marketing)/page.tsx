import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { createClient } from "@/utils/supabase/server";
import { LandingClient } from "@/components/marketing/landing-client";

export const revalidate = 60; // Revalidate live stats every 60s

export default async function LandingPage() {
  const supabase = await createClient();

  // Pull REAL aggregate statistics from Supabase tables
  const [{ count: openJobsCount }, { count: studentCount }, { count: institutionCount }] =
    await Promise.all([
      supabase.from("jobs").select("*", { count: "exact", head: true }).eq("status", "open"),
      supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "student"),
      supabase.from("institutions").select("*", { count: "exact", head: true }).eq("verified", true),
    ]);

  return (
    <div className="flex min-h-screen flex-col bg-[#FAFBFC]">
      <Navbar />
      <main className="flex-1">
        <LandingClient
          openJobsCount={openJobsCount || 0}
          studentCount={studentCount || 0}
          institutionCount={institutionCount || 0}
        />
      </main>
      <Footer />
    </div>
  );
}
