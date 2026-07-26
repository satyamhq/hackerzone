import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
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

  // Protected Route Guards
  const isStudentRoute = pathname.startsWith("/(student)") || pathname.startsWith("/student");
  const isEmployerRoute = pathname.startsWith("/(employer)") || pathname.startsWith("/employer");
  const isInstitutionRoute = pathname.startsWith("/(institution)") || pathname.startsWith("/institution");
  const isAdminRoute = pathname.startsWith("/(admin)") || pathname.startsWith("/admin");

  if (isStudentRoute || isEmployerRoute || isInstitutionRoute || isAdminRoute) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/sign-in";
      url.searchParams.set("redirectTo", pathname);
      return NextResponse.redirect(url);
    }

    // Fetch user profile role
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const role = profile?.role;

    // Enforce Role Guards
    if (isStudentRoute && role !== "student") {
      const url = request.nextUrl.clone();
      url.pathname = "/sign-in";
      url.searchParams.set("redirectTo", pathname);
      return NextResponse.redirect(url);
    }

    if (isEmployerRoute && role !== "employer") {
      const url = request.nextUrl.clone();
      url.pathname = "/sign-in";
      url.searchParams.set("redirectTo", pathname);
      return NextResponse.redirect(url);
    }

    if (isInstitutionRoute && role !== "institution_admin") {
      const url = request.nextUrl.clone();
      url.pathname = "/sign-in";
      url.searchParams.set("redirectTo", pathname);
      return NextResponse.redirect(url);
    }

    if (isAdminRoute && role !== "admin") {
      const url = request.nextUrl.clone();
      url.pathname = "/sign-in";
      url.searchParams.set("redirectTo", pathname);
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
