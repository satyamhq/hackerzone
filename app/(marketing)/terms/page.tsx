import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";

export default function TermsOfServicePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 container py-16 max-w-3xl">
        <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>
        <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
          <p>
            Welcome to Hackerzone. By accessing our platform, you agree to these terms governing student job matching, employer job postings, and university career center analytics.
          </p>
          <h2 className="text-lg font-bold text-foreground pt-4">1. Employer Conduct & Message Quotas</h2>
          <p>
            Employers must adhere to plan-based messaging quotas (`employer_plans`). Spamming or scraping student profile data is strictly prohibited.
          </p>
          <h2 className="text-lg font-bold text-foreground pt-4">2. Authentic Job Listings</h2>
          <p>
            All posted jobs must represent genuine hiring opportunities with transparent skill requirements and salary ranges.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
