import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const domain = searchParams.get("domain") || "all";

  const supabase = await createClient();

  // Fetch real aggregate stats from applications
  const { data: applications, error } = await supabase
    .from("applications")
    .select("status, applied_at, jobs(title, companies(name)), students(graduation_year, location)");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Construct CSV String
  const headers = ["Application ID", "Job Title", "Company", "Status", "Graduation Year", "Applied At"];
  const rows = (applications || []).map((app: any, idx: number) => [
    `APP-${idx + 1001}`,
    `"${app.jobs?.title || "Position"}"`,
    `"${app.jobs?.companies?.name || "Employer"}"`,
    app.status,
    app.students?.graduation_year || "2026",
    new Date(app.applied_at).toISOString().split("T")[0],
  ]);

  const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

  return new Response(csvContent, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="institution_placement_report_${domain}.csv"`,
    },
  });
}
