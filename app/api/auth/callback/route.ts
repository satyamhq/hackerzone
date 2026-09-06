import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const roleIntent = requestUrl.searchParams.get("role") || "student";
  const origin = requestUrl.origin;

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options as any)
              );
            } catch {
              // Ignore inside route handler
            }
          },
        },
      }
    );

    const { data: { user }, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && user) {
      // Check existing profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("role, onboarding_completed, username")
        .eq("id", user.id)
        .single();

      if (!profile || !profile.onboarding_completed) {
        // Direct to role-specific onboarding
        const userRole = profile?.role || roleIntent;
        if (userRole === "recruiter") {
          return NextResponse.redirect(`${origin}/onboarding/recruiter`);
        } else if (userRole === "campus_admin") {
          return NextResponse.redirect(`${origin}/onboarding/campus-admin`);
        }
        return NextResponse.redirect(`${origin}/onboarding/student`);
      }

      // If already onboarded, redirect to role dashboard
      switch (profile.role) {
        case "recruiter":
          return NextResponse.redirect(`${origin}/company/dashboard`);
        case "campus_admin":
          return NextResponse.redirect(`${origin}/campus-admin/dashboard`);
        case "admin":
          return NextResponse.redirect(`${origin}/admin/dashboard`);
        case "student":
        default:
          return NextResponse.redirect(`${origin}/dashboard`);
      }
    }
  }

  // Fallback to login with error
  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
