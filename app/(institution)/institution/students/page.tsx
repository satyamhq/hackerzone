"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { createClient } from "@/utils/supabase/client";
import { getInstitutionAdmin, getAffiliatedStudentsRoster } from "@/lib/supabase/institutions";
import { ArrowLeft, UserCheck, Users } from "lucide-react";

export default function InstitutionStudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [domain, setDomain] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadRoster() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const adminData = await getInstitutionAdmin(user.id);
        if (adminData?.institutions?.domain) {
          setDomain(adminData.institutions.domain);
          const roster = await getAffiliatedStudentsRoster(adminData.institutions.domain);
          setStudents(roster);
        }
      }
      setIsLoading(false);
    }

    loadRoster();
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 container py-10 flex items-center justify-center">
          <p className="text-muted-foreground">Loading student roster...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 container py-10 max-w-5xl">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/institution/dashboard" className="p-2 rounded-md border hover:bg-accent text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Affiliated Student Roster</h1>
            <p className="text-xs text-muted-foreground">
              Opt-in public candidate profiles registered under campus domain <span className="font-semibold">{domain}</span>.
            </p>
          </div>
        </div>

        {students.length === 0 ? (
          <div className="p-12 border rounded-lg bg-muted/20 text-center space-y-2">
            <Users className="h-10 w-10 text-muted-foreground mx-auto" />
            <h3 className="font-semibold text-sm">No student profiles registered yet</h3>
            <p className="text-xs text-muted-foreground">Students signing up with your campus domain will appear here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {students.map((student) => {
              const profile = student.profiles;
              return (
                <div key={student.id} className="p-5 border rounded-lg bg-background shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-base">{profile?.full_name || "Student Candidate"}</div>
                    {student.graduation_year && (
                      <span className="text-xs px-2 py-0.5 rounded bg-muted font-medium">Class of {student.graduation_year}</span>
                    )}
                  </div>

                  <p className="text-xs text-muted-foreground line-clamp-2">{student.headline || "Engineering Undergrad"}</p>

                  <div className="flex flex-wrap gap-1.5 pt-2 border-t">
                    {student.skills?.slice(0, 4).map((skill: string) => (
                      <span key={skill} className="text-[11px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="pt-2 flex justify-end">
                    <Link
                      href={`/student/${student.id}`}
                      target="_blank"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                    >
                      <UserCheck className="h-3.5 w-3.5" /> View Public Profile
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
