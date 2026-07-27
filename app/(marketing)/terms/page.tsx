import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";

export default function TermsOfServicePage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#FAFBFC]">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full space-y-8">
        <div className="space-y-3">
          <Badge variant="brand" className="px-3.5 py-1">
            <FileText className="h-4 w-4 mr-1.5 text-blue-600" />
            <span>Platform Agreement</span>
          </Badge>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Terms of Service</h1>
          <p className="text-xs font-semibold text-slate-500">
            Last updated: July 2026 • Governing Platform Usage for Candidates & Employers
          </p>
        </div>

        <Card className="p-8 md:p-12 space-y-6 text-sm text-slate-700 leading-relaxed">
          <p className="text-base text-slate-800 font-medium">
            Welcome to Hackerzone. By accessing or creating an account on our platform, you agree to comply with these terms governing candidate profile verification, employer job postings, and university career center analytics.
          </p>

          <div className="pt-4 border-t border-slate-100 space-y-3">
            <h2 className="text-xl font-bold text-slate-900">1. Employer Conduct & Message Quotas</h2>
            <p>
              Employers must adhere to plan-based messaging quotas (`employer_plans`). Outbound messages to candidates must be relevant to genuine technical job openings. Scraping candidate profiles or sending unsolicited marketing spam is strictly prohibited and results in immediate account suspension.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 space-y-3">
            <h2 className="text-xl font-bold text-slate-900">2. Genuine Tech Openings</h2>
            <p>
              All job listings posted on Hackerzone must represent authentic engineering or technical opportunities with accurate skill requirements, compensation ranges, and location details.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 space-y-3">
            <h2 className="text-xl font-bold text-slate-900">3. Student Verification</h2>
            <p>
              Students warrant that all project skills, repository links, and university email domain verifications represent accurate technical credentials.
            </p>
          </div>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
