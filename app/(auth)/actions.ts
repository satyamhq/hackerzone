"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function signUpAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = (formData.get("role") as string) || "student";
  const fullName = formData.get("fullName") as string;
  const institutionEmail = formData.get("institutionEmail") as string;

  if (!email || !password || !fullName) {
    return { error: "Please fill in all required fields." };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        role,
        full_name: fullName,
        institution_email: institutionEmail || null,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  // Redirect based on selected role
  if (role === "student") {
    redirect("/student/onboarding");
  } else if (role === "employer") {
    redirect("/employer/onboarding");
  } else if (role === "institution_admin") {
    redirect("/institution/onboarding");
  }

  redirect("/");
}

export async function signInAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const redirectTo = (formData.get("redirectTo") as string) || null;

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  if (redirectTo) {
    redirect(redirectTo);
  }

  // Fetch user role from profiles to redirect appropriately
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .single();

  const role = (profile as { role?: string } | null)?.role || "student";

  if (role === "student") {
    redirect("/student/dashboard");
  } else if (role === "employer") {
    redirect("/employer/dashboard");
  } else if (role === "institution_admin") {
    redirect("/institution/dashboard");
  } else if (role === "admin") {
    redirect("/admin/dashboard");
  }

  redirect("/");
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/sign-in");
}

export async function forgotPasswordAction(formData: FormData) {
  const email = formData.get("email") as string;

  if (!email) {
    return { error: "Please enter your email address." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/auth/callback?next=/reset-password`,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: "Password reset link sent to your email!" };
}
