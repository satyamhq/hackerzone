"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { createClient } from "@/lib/supabase/client";
import {
  getPendingInstitutions,
  verifyInstitution,
  getPendingCompanies,
  verifyCompany,
} from "@/lib/supabase/admin";
import { ArrowLeft, Building2, CheckCircle2, GraduationCap, XCircle } from "lucide-react";

export default function AdminVerificationsPage() {
  const [institutions, setInstitutions] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadQueues() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if ((profile as { role?: string } | null)?.role === "admin") {
          setIsAdmin(true);
          const [instList, compList] = await Promise.all([
            getPendingInstitutions(),
            getPendingCompanies(),
          ]);
          setInstitutions(instList);
          setCompanies(compList);
        }
      }
      setIsLoading(false);
    }

    loadQueues();
  }, []);

  async function handleVerifyInstitution(id: string, targetVerified: boolean) {
    try {
      await verifyInstitution(id, targetVerified);
      setInstitutions((prev) =>
        prev.map((inst) => (inst.id === id ? { ...inst, verified: targetVerified } : inst))
      );
      setStatusMessage(`Institution status updated to ${targetVerified ? "VERIFIED" : "UNVERIFIED"}.`);
      setTimeout(() => setStatusMessage(null), 4000);
    } catch (err: any) {
      alert(`Error updating institution: ${err.message}`);
    }
  }

  async function handleVerifyCompany(id: string, targetVerified: boolean) {
    try {
      await verifyCompany(id, targetVerified);
      setCompanies((prev) =>
        prev.map((comp) => (comp.id === id ? { ...comp, verified: targetVerified } : comp))
      );
      setStatusMessage(`Company status updated to ${targetVerified ? "VERIFIED" : "UNVERIFIED"}.`);
      setTimeout(() => setStatusMessage(null), 4000);
    } catch (err: any) {
      alert(`Error updating company: ${err.message}`);
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 container py-10 flex items-center justify-center">
          <p className="text-muted-foreground">Loading verification queues...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 container py-16 text-center">
          <h1 className="text-2xl font-bold">403 Access Denied</h1>
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
          <Link href="/admin/dashboard" className="p-2 rounded-md border hover:bg-accent text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Verification Queues</h1>
            <p className="text-xs text-muted-foreground">Review and verify institution domains and employer companies.</p>
          </div>
        </div>

        {statusMessage && (
          <div className="p-3 mb-6 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-md">
            {statusMessage}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Institution Verification Queue */}
          <div className="space-y-4">
            <h2 className="font-bold text-lg flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary" /> Institutions Queue ({institutions.length})
            </h2>

            {institutions.length === 0 ? (
              <p className="text-xs text-muted-foreground">No institutions found.</p>
            ) : (
              <div className="space-y-3">
                {institutions.map((inst) => (
                  <div key={inst.id} className="p-4 border rounded-lg bg-background shadow-sm space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-bold text-base">{inst.name}</div>
                        <div className="text-xs text-muted-foreground">Domain: {inst.domain} • {inst.city}, {inst.state}</div>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${inst.verified ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                        {inst.verified ? "Verified" : "Pending"}
                      </span>
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t">
                      {inst.verified ? (
                        <button
                          onClick={() => handleVerifyInstitution(inst.id, false)}
                          className="px-3 py-1 rounded border text-xs text-destructive hover:bg-destructive/10"
                        >
                          Revoke Verification
                        </button>
                      ) : (
                        <button
                          onClick={() => handleVerifyInstitution(inst.id, true)}
                          className="px-3 py-1 rounded bg-primary text-primary-foreground font-semibold text-xs hover:bg-primary/90"
                        >
                          Approve Institution
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Company Verification Queue */}
          <div className="space-y-4">
            <h2 className="font-bold text-lg flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" /> Companies Queue ({companies.length})
            </h2>

            {companies.length === 0 ? (
              <p className="text-xs text-muted-foreground">No companies found.</p>
            ) : (
              <div className="space-y-3">
                {companies.map((comp) => (
                  <div key={comp.id} className="p-4 border rounded-lg bg-background shadow-sm space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-bold text-base">{comp.name}</div>
                        <div className="text-xs text-muted-foreground">{comp.industry} • {comp.website || "No website"}</div>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${comp.verified ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                        {comp.verified ? "Verified" : "Pending"}
                      </span>
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t">
                      {comp.verified ? (
                        <button
                          onClick={() => handleVerifyCompany(comp.id, false)}
                          className="px-3 py-1 rounded border text-xs text-destructive hover:bg-destructive/10"
                        >
                          Revoke Verification
                        </button>
                      ) : (
                        <button
                          onClick={() => handleVerifyCompany(comp.id, true)}
                          className="px-3 py-1 rounded bg-primary text-primary-foreground font-semibold text-xs hover:bg-primary/90"
                        >
                          Approve Company
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
