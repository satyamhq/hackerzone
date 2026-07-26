"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { createClient } from "@/utils/supabase/client";
import {
  createCompany,
  joinCompany,
  searchCompanies,
  getEmployerCompany,
} from "@/lib/supabase/employers";
import { Building2, Plus, Search } from "lucide-react";

export default function CompanySetupPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [mode, setMode] = useState<"create" | "join">("create");

  // Create Mode State
  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [industry, setIndustry] = useState("");
  const [sizeRange, setSizeRange] = useState("10-50");
  const [description, setDescription] = useState("");

  // Join Mode State
  const [searchTerm, setSearchTerm] = useState("");
  const [searchHits, setSearchHits] = useState<any[]>([]);

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
        const existing = await getEmployerCompany(user.id);
        if (existing) {
          router.push("/employer/dashboard");
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
      const results = await searchCompanies(term);
      setSearchHits(results);
    } else {
      setSearchHits([]);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!userId) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await createCompany(userId, {
        name,
        website,
        industry,
        size_range: sizeRange,
        description,
      });
      router.push("/employer/dashboard");
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to create company.");
      setIsSubmitting(false);
    }
  }

  async function handleJoin(companyId: string) {
    if (!userId) return;
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await joinCompany(userId, companyId);
      router.push("/employer/dashboard");
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to join company.");
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 container py-10 flex items-center justify-center">
          <p className="text-muted-foreground">Checking company status...</p>
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
          <h1 className="text-3xl font-bold">Company Setup</h1>
          <p className="text-muted-foreground text-sm">
            Create a new company profile or join your existing team on Hackerzone.
          </p>
        </div>

        {errorMessage && (
          <div className="p-4 mb-6 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
            {errorMessage}
          </div>
        )}

        {/* Mode Toggle */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-muted rounded-lg text-center text-sm font-medium mb-8">
          <button
            type="button"
            onClick={() => setMode("create")}
            className={`py-2 rounded-md transition-colors ${
              mode === "create" ? "bg-background text-primary shadow-sm font-semibold" : "text-muted-foreground"
            }`}
          >
            Create New Company
          </button>
          <button
            type="button"
            onClick={() => setMode("join")}
            className={`py-2 rounded-md transition-colors ${
              mode === "join" ? "bg-background text-primary shadow-sm font-semibold" : "text-muted-foreground"
            }`}
          >
            Join Existing Company
          </button>
        </div>

        {mode === "create" ? (
          <form onSubmit={handleCreate} className="bg-background border rounded-xl p-6 space-y-4 shadow-sm">
            <div>
              <label className="block text-sm font-medium mb-1">Company Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Acme Tech Solutions"
                className="w-full h-10 px-3 rounded-md border text-sm focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Website URL</label>
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://acme.example.com"
                className="w-full h-10 px-3 rounded-md border text-sm focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Industry</label>
                <input
                  type="text"
                  required
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  placeholder="e.g. Artificial Intelligence"
                  className="w-full h-10 px-3 rounded-md border text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Company Size</label>
                <select
                  value={sizeRange}
                  onChange={(e) => setSizeRange(e.target.value)}
                  className="w-full h-10 px-3 rounded-md border text-sm bg-background focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  <option value="1-10">1-10 Employees</option>
                  <option value="10-50">10-50 Employees</option>
                  <option value="50-200">50-200 Employees</option>
                  <option value="200-500">200-500 Employees</option>
                  <option value="500+">500+ Employees</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                rows={4}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your company mission, tech stack, and workplace culture..."
                className="w-full p-3 rounded-md border text-sm focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-10 rounded-md bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 disabled:opacity-50"
            >
              {isSubmitting ? "Creating..." : "Create & Continue"}
            </button>
          </form>
        ) : (
          <div className="bg-background border rounded-xl p-6 space-y-4 shadow-sm">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search company by name..."
                className="w-full h-10 pl-9 pr-3 rounded-md border text-sm focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>

            <div className="space-y-2 pt-2">
              {searchHits.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-4">
                  {searchTerm.length < 2 ? "Type at least 2 characters to search" : "No registered companies found."}
                </p>
              ) : (
                searchHits.map((company) => (
                  <div
                    key={company.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:border-primary/50 transition-colors"
                  >
                    <div>
                      <div className="font-semibold text-sm">{company.name}</div>
                      <div className="text-xs text-muted-foreground">{company.industry} • {company.website || "No website"}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleJoin(company.id)}
                      disabled={isSubmitting}
                      className="px-3 py-1.5 rounded-md bg-secondary text-secondary-foreground font-medium text-xs hover:bg-secondary/80"
                    >
                      Join Team
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
