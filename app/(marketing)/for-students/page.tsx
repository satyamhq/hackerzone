import Link from "next/link";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { ArrowRight, CheckCircle2, FileText, Sparkles, UserCheck } from "lucide-react";

export default function ForStudentsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 container py-16 max-w-5xl">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-bold bg-primary/10 text-primary">
            <UserCheck className="h-4 w-4" />
            <span>Student Career Suite</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Launch Your Engineering Career on Hackerzone
          </h1>
          <p className="text-muted-foreground text-base">
            Build your verified technical profile, get matched with top AI engineering roles, and track applications in real time.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="p-8 border rounded-2xl bg-background shadow-sm space-y-4">
            <Sparkles className="h-8 w-8 text-primary" />
            <h3 className="text-xl font-bold">Skill-Based Overlap Matching</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              No black-box filters. Jobs are scored dynamically based on your verified tech skills (React, TypeScript, Python, Next.js), recency, and location preferences.
            </p>
          </div>

          <div className="p-8 border rounded-2xl bg-background shadow-sm space-y-4">
            <FileText className="h-8 w-8 text-primary" />
            <h3 className="text-xl font-bold">Private Storage & Signed Resumes</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your resume PDF is stored securely in a private bucket. Only verified recruiters who receive your application can view signed URLs.
            </p>
          </div>
        </div>

        <div className="text-center bg-muted/40 p-12 rounded-2xl border space-y-4">
          <h2 className="text-2xl font-bold">Ready to kickstart your tech journey?</h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Create your student profile in less than 2 minutes and start matching with open developer positions across India.
          </p>
          <Link
            href="/sign-up"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-primary text-primary-foreground font-bold text-sm shadow hover:bg-primary/90"
          >
            <span>Create Student Account</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
