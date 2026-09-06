import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/types/database.types";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "",
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options as any)
          );
        },
      },
    }
  );

  const pathname = request.nextUrl.pathname;

  // Static files and public marketing routes
  const isPublicAuthRoute = pathname === "/login" || pathname === "/sign-in" || pathname === "/sign-up" || pathname.startsWith("/onboarding");
  const isStudentRoute = pathname.startsWith("/student") || pathname.startsWith("/dashboard") || pathname.startsWith("/jobs") || pathname.startsWith("/applications") || pathname.startsWith("/arena") || pathname.startsWith("/events") || pathname.startsWith("/mentors") || pathname.startsWith("/messages") || pathname.startsWith("/learn") || pathname.startsWith("/settings");
  const isEmployerRoute = pathname.startsWith("/employer") || pathname.startsWith("/company");
  const isCampusAdminRoute = pathname.startsWith("/institution") || pathname.startsWith("/campus-admin");
  const isAdminRoute = pathname.startsWith("/admin");

  const isProtectedRoute = isStudentRoute || isEmployerRoute || isCampusAdminRoute || isAdminRoute;

  // Session validation
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect unauthenticated users from protected routes
  if (isProtectedRoute && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(url);
  }

  // If user is authenticated
  if (user) {
    // Fetch profile role and onboarding status
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, onboarding_completed")
      .eq("id", user.id)
      .single();

    const role = profile?.role;
    const isOnboarded = profile?.onboarding_completed;

    // If on /login or /sign-in, redirect directly to dashboard
    if (pathname === "/login" || pathname === "/sign-in" || pathname === "/sign-up") {
      if (!isOnboarded) {
        const onboardingUrl = request.nextUrl.clone();
        if (role === "recruiter") onboardingUrl.pathname = "/onboarding/recruiter";
        else if (role === "campus_admin") onboardingUrl.pathname = "/onboarding/campus-admin";
        else onboardingUrl.pathname = "/onboarding/student";
        return NextResponse.redirect(onboardingUrl);
      }

      const redirectUrl = request.nextUrl.clone();
      if (role === "recruiter") redirectUrl.pathname = "/company/dashboard";
      else if (role === "campus_admin") redirectUrl.pathname = "/campus-admin/dashboard";
      else if (role === "admin") redirectUrl.pathname = "/admin/dashboard";
      else redirectUrl.pathname = "/dashboard";
      return NextResponse.redirect(redirectUrl);
    }

    // If user is accessing protected routes but hasn't completed onboarding
    if (isProtectedRoute && !isOnboarded && !pathname.startsWith("/onboarding")) {
      const url = request.nextUrl.clone();
      if (role === "recruiter") url.pathname = "/onboarding/recruiter";
      else if (role === "campus_admin") url.pathname = "/onboarding/campus-admin";
      else url.pathname = "/onboarding/student";
      return NextResponse.redirect(url);
    }

    // Role-based route authorization guards
    if (isEmployerRoute && role !== "recruiter" && role !== "admin") {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }

    if (isCampusAdminRoute && role !== "campus_admin" && role !== "admin") {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }

    if (isAdminRoute && role !== "admin") {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
