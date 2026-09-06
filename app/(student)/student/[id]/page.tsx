import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Github, Globe, Linkedin, MapPin, UserCheck } from "lucide-react";

export default async function PublicStudentProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();

  const { data: student, error } = await supabase
    .from("students")
    .select("*, profiles(full_name, avatar_url)")
    .eq("id", params.id)
    .single();

  if (error || !student) {
    notFound();
  }

  // Verify access permissions: must be marked public OR viewed by auth user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isOwner = user?.id === student.user_id;

  if (!student.is_public && !isOwner) {
    // Check if current user is an employer who received an application from this student
    if (user) {
      const { data: appData } = await supabase
        .from("applications")
        .select("id, jobs(company_id)")
        .eq("student_id", student.id);

      const { data: empMember } = await supabase
        .from("employer_members")
        .select("company_id")
        .eq("user_id", user.id);

      const empCompanyIds = empMember?.map((e) => e.company_id) || [];
      const hasAppliedToEmployer = appData?.some((a) =>
        empCompanyIds.includes((a.jobs as any)?.company_id)
      );

      if (!hasAppliedToEmployer) {
        return (
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1 container py-16 text-center">
              <h1 className="text-2xl font-bold mb-2">Private Profile</h1>
              <p className="text-muted-foreground text-sm max-w-md mx-auto">
                This student profile is private and only visible to authorized recruiters who received an application.
              </p>
            </main>
            <Footer />
          </div>
        );
      }
    } else {
      notFound();
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 container py-10 max-w-3xl">
        <div className="bg-background border rounded-xl p-8 shadow-sm space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl">
              {student.profiles?.full_name?.charAt(0) || "S"}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{student.profiles?.full_name || "Student Candidate"}</h1>
              {student.headline && <p className="text-muted-foreground font-medium text-sm">{student.headline}</p>}
              {student.location && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>{student.location}</span>
                  {student.graduation_year && <span>• Class of {student.graduation_year}</span>}
                </div>
              )}
            </div>
          </div>

          {student.bio && (
            <div className="border-t pt-4">
              <h3 className="font-semibold text-sm mb-1 text-muted-foreground">About</h3>
              <p className="text-sm whitespace-pre-line leading-relaxed">{student.bio}</p>
            </div>
          )}

          {student.skills && student.skills.length > 0 && (
            <div className="border-t pt-4">
              <h3 className="font-semibold text-sm mb-2 text-muted-foreground">Verified Skills</h3>
              <div className="flex flex-wrap gap-2">
                {student.skills.map((skill: string) => (
                  <span
                    key={skill}
                    className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {student.links && (
            <div className="border-t pt-4 flex gap-4">
              {student.links.github && (
                <a
                  href={student.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
                >
                  <Github className="h-4 w-4" /> GitHub
                </a>
              )}
              {student.links.linkedin && (
                <a
                  href={student.links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
                >
                  <Linkedin className="h-4 w-4" /> LinkedIn
                </a>
              )}
              {student.links.portfolio && (
                <a
                  href={student.links.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
                >
                  <Globe className="h-4 w-4" /> Portfolio
                </a>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
