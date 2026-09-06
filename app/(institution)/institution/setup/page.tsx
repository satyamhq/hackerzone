"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { createClient } from "@/lib/supabase/client";
import {
  getInstitutionAdmin,
  searchInstitutions,
  claimInstitutionAdmin,
  createInstitutionRequest,
} from "@/lib/supabase/institutions";
import { GraduationCap, Search } from "lucide-react";

export default function InstitutionSetupPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [mode, setMode] = useState<"claim" | "request">("claim");

  // Claim Mode State
  const [searchTerm, setSearchTerm] = useState("");
  const [searchHits, setSearchHits] = useState<any[]>([]);

  // Request Mode State
  const [name, setName] = useState("");
  const [domain, setDomain] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function init() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setUserId(user.id);
        const existing = await getInstitutionAdmin(user.id);
        if (existing) {
          router.push("/institution/dashboard");
          return;
        }
      }
      setIsLoading(false);
    }
    init();
  }, [router]);

  async function handleSearch(term: string) {
    setSearchTerm(term);
    if (term.trim().length >= 2) {
      const hits = await searchInstitutions(term);
      setSearchHits(hits);
    } else {
      setSearchHits([]);
    }
  }

  async function handleClaim(institutionId: string) {
    if (!userId) return;
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await claimInstitutionAdmin(userId, institutionId);
      router.push("/institution/dashboard");
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to claim institution.");
      setIsSubmitting(false);
    }
  }

  async function handleRequest(e: React.FormEvent) {
    e.preventDefault();
    if (!userId) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await createInstitutionRequest(name, domain, city, state, userId);
      router.push("/institution/dashboard");
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to submit request.");
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 container py-10 flex items-center justify-center">
          <p className="text-muted-foreground">Checking institution status...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 container py-10 max-w-2xl">
        <div className="text-center space-y-2 mb-8">
          <GraduationCap className="h-10 w-10 text-primary mx-auto" />
          <h1 className="text-3xl font-bold">Institution & Career Center Setup</h1>
          <p className="text-muted-foreground text-sm">
            Claim your university record or submit a new institution verification request.
          </p>
        </div>

        {errorMessage && (
          <div className="p-4 mb-6 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
            {errorMessage}
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 p-1 bg-muted rounded-lg text-center text-sm font-medium mb-8">
          <button
            type="button"
            onClick={() => setMode("claim")}
            className={`py-2 rounded-md transition-colors ${
              mode === "claim" ? "bg-background text-primary shadow-sm font-semibold" : "text-muted-foreground"
            }`}
          >
            Claim Registered University
          </button>
          <button
            type="button"
            onClick={() => setMode("request")}
            className={`py-2 rounded-md transition-colors ${
              mode === "request" ? "bg-background text-primary shadow-sm font-semibold" : "text-muted-foreground"
            }`}
          >
            Register New Institution
          </button>
        </div>

        {mode === "claim" ? (
          <div className="bg-background border rounded-xl p-6 space-y-4 shadow-sm">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search by university name or domain (e.g. IIT Bombay, iitb.ac.in)..."
                className="w-full h-10 pl-9 pr-3 rounded-md border text-sm focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>

            <div className="space-y-2 pt-2">
              {searchHits.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-4">
                  {searchTerm.length < 2 ? "Type at least 2 characters to search" : "No matching registered institutions found."}
                </p>
              ) : (
                searchHits.map((inst) => (
                  <div key={inst.id} className="flex items-center justify-between p-3 border rounded-lg hover:border-primary/50 transition-colors">
                    <div>
                      <div className="font-semibold text-sm flex items-center gap-2">
                        {inst.name}
                        {inst.verified ? (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">Verified</span>
                        ) : (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-semibold">Pending Admin Review</span>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">Domain: {inst.domain} • {inst.city}, {inst.state}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleClaim(inst.id)}
                      disabled={isSubmitting}
                      className="px-3 py-1.5 rounded-md bg-secondary text-secondary-foreground font-medium text-xs hover:bg-secondary/80"
                    >
                      Claim Admin Role
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          <form onSubmit={handleRequest} className="bg-background border rounded-xl p-6 space-y-4 shadow-sm">
            <div>
              <label className="block text-sm font-medium mb-1">Institution Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. BITS Pilani"
                className="w-full h-10 px-3 rounded-md border text-sm focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Campus Domain (e.g. bits-pilani.ac.in)</label>
              <input
                type="text"
                required
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="bits-pilani.ac.in"
                className="w-full h-10 px-3 rounded-md border text-sm focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">City</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Pilani"
                  className="w-full h-10 px-3 rounded-md border text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">State</label>
                <input
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="e.g. Rajasthan"
                  className="w-full h-10 px-3 rounded-md border text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-10 rounded-md bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "Submit Registration Request"}
            </button>
          </form>
        )}
      </main>

      <Footer />
    </div>
  );
}
