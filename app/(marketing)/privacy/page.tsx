import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#FAFBFC]">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full space-y-8">
        <div className="space-y-3">
          <Badge variant="brand" className="px-3.5 py-1">
            <ShieldCheck className="h-4 w-4 mr-1.5 text-blue-600" />
            <span>Data Protection & Privacy</span>
          </Badge>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Privacy Policy</h1>
          <p className="text-xs font-semibold text-slate-500">
            Last updated: July 2026 • Compliant with Indian DPDP Act & Global Privacy Standards
          </p>
        </div>

        <Card className="p-8 md:p-12 space-y-6 text-sm text-slate-700 leading-relaxed">
          <p className="text-base text-slate-800 font-medium">
            At Hackerzone Technologies India, we prioritize candidate privacy and security. This Privacy Policy details how we collect, store, and share data across our three-sided career marketplace.
          </p>

          <div className="pt-4 border-t border-slate-100 space-y-3">
            <h2 className="text-xl font-bold text-slate-900">1. Resume & Candidate Data Protection</h2>
            <p>
              Student technical resumes are encrypted and stored in private object storage. Your resume PDF and contact information are shared exclusively with verified tech recruiters when you explicitly apply for a position or opt-in to campus placement drives.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 space-y-3">
            <h2 className="text-xl font-bold text-slate-900">2. Row Level Security (RLS) Controls</h2>
            <p>
              All application data, profile attributes, and direct messages are guarded by automated Postgres Row Level Security (RLS) policies. Only authorized users with valid JWT tokens can view or mutate their respective records.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 space-y-3">
            <h2 className="text-xl font-bold text-slate-900">3. Data Retention & Deletion</h2>
            <p>
              You maintain full control over your data. You may request account deletion or data exports at any time by contacting our privacy response team.
            </p>
          </div>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
