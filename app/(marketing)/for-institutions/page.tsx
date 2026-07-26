import Link from "next/link";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { ArrowRight, BarChart3, Calendar, Download, GraduationCap } from "lucide-react";

export default function ForInstitutionsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 container py-16 max-w-5xl">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-bold bg-primary/10 text-primary">
            <GraduationCap className="h-4 w-4" />
            <span>Career Center Portal</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Streamline Campus Placement Operations
          </h1>
          <p className="text-muted-foreground text-base">
            Empower university placement officers with real-time student application tracking, campus event management, and instant CSV reporting.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="p-6 border rounded-2xl bg-background shadow-sm space-y-3">
            <BarChart3 className="h-8 w-8 text-primary" />
            <h3 className="font-bold text-lg">Real Placement Metrics</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Track student applications, shortlisted counts, and verified job offers grouped by your university email domain.
            </p>
          </div>

          <div className="p-6 border rounded-2xl bg-background shadow-sm space-y-3">
            <Calendar className="h-8 w-8 text-primary" />
            <h3 className="font-bold text-lg">Campus Fairs & Workshops</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Schedule virtual or on-campus career fairs and technical workshops that surface directly on your students' dashboards.
            </p>
          </div>

          <div className="p-6 border rounded-2xl bg-background shadow-sm space-y-3">
            <Download className="h-8 w-8 text-primary" />
            <h3 className="font-bold text-lg">Instant CSV Export</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Generate server-side CSV outcome reports for accreditation, NIRF data submission, and university leadership.
            </p>
          </div>
        </div>

        <div className="text-center bg-muted/40 p-12 rounded-2xl border space-y-4">
          <h2 className="text-2xl font-bold">Claim your campus profile on Hackerzone</h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Join leading Indian institutions like IIT Bombay and BITS Pilani in modernizing career center workflows.
          </p>
          <Link
            href="/sign-up"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-primary text-primary-foreground font-bold text-sm shadow hover:bg-primary/90"
          >
            <span>Register Institution</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
