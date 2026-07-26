import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";

export default function PrivacyPolicyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 container py-16 max-w-3xl">
        <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
        <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
          <p>
            At Hackerzone, we prioritize student candidate privacy and data protection. This policy outlines how we handle personal data across our three-sided marketplace.
          </p>
          <h2 className="text-lg font-bold text-foreground pt-4">1. Resume & Profile Data</h2>
          <p>
            Student resumes are stored in encrypted private buckets. Resumes and contact information are shared exclusively with employers when a candidate explicitly submits a job application.
          </p>
          <h2 className="text-lg font-bold text-foreground pt-4">2. Row Level Security</h2>
          <p>
            Database access is guarded strictly via Supabase Row Level Security (RLS) policies.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
