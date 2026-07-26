// Supabase Edge Function: Job Alerts Engine
// Runs on a cron schedule to evaluate saved_searches filters against active jobs

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

Deno.serve(async (req) => {
  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // 1. Fetch saved searches
    const { data: searches, error: searchErr } = await supabase
      .from("saved_searches")
      .select("*");

    if (searchErr) throw searchErr;

    let alertCount = 0;

    for (const alert of searches || []) {
      const filters = alert.filters || {};
      
      // Match query against recent jobs
      let query = supabase
        .from("jobs")
        .select("id, title, company_id")
        .eq("status", "open")
        .order("created_at", { ascending: false })
        .limit(5);

      if (filters.skills && filters.skills.length > 0) {
        query = query.overlaps("skills_required", filters.skills);
      }

      const { data: matchedJobs } = await query;

      if (matchedJobs && matchedJobs.length > 0) {
        // Trigger Notification
        await supabase.from("notifications").insert({
          user_id: alert.user_id,
          type: "job_alert_match",
          payload: {
            alert_name: alert.name,
            matched_count: matchedJobs.length,
            message: `Found ${matchedJobs.length} new matching job(s) for your saved search "${alert.name}".`,
          },
        });
        alertCount++;
      }
    }

    return new Response(
      JSON.stringify({ success: true, processedSearches: searches?.length, alertsSent: alertCount }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
});
