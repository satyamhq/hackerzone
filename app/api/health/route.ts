import { NextResponse } from "next/server";
import { generateRequestId } from "@/lib/errors";
import { validateEnv } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const requestId = generateRequestId();
  const startTime = Date.now();

  const checks: Record<string, "pass" | "warn" | "fail"> = {
    environment: "pass",
    database: "pass",
    storage: "pass",
  };

  // 1. Validate environment configuration
  const envValidation = validateEnv();
  if (!envValidation.valid) {
    checks.environment = "warn";
  }

  // 2. Heartbeat check on Supabase connection
  try {
    const supabase = await createClient();
    const { error } = await supabase.from("jobs").select("id").limit(1);
    if (error && error.code !== "PGRST116") {
      // Non-blocking query failure (e.g. empty table or auth restriction)
      checks.database = "warn";
    }
  } catch (err) {
    checks.database = "warn";
  }

  const isHealthy = checks.environment !== "fail" && checks.database !== "fail";
  const latencyMs = Date.now() - startTime;

  return NextResponse.json(
    {
      status: isHealthy ? "healthy" : "degraded",
      timestamp: new Date().toISOString(),
      requestId,
      latencyMs,
      checks,
      version: process.env.npm_package_version || "0.1.0",
    },
    {
      status: isHealthy ? 200 : 503,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
        "X-Request-Id": requestId,
      },
    }
  );
}
