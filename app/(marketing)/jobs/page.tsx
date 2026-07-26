"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { createClient } from "@/utils/supabase/client";
import { searchJobs, saveSearchFilter } from "@/lib/supabase/jobs";
import { Briefcase, Bookmark, ChevronLeft, ChevronRight, MapPin, Search, Sparkles, X } from "lucide-react";

export default function JobsSearchPage() {
  const [query, setQuery] = useState("");
  const [jobType, setJobType] = useState("all");
  const [location, setLocation] = useState("");
  const [isRemote, setIsRemote] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [page, setPage] = useState(1);

  const [jobs, setJobs] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [availableSkills, setAvailableSkills] = useState<string[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  useEffect(() => {
    async function loadSkillsAndUser() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setUserId(user.id);
      }

      const { data: skillsData } = await supabase.from("skills").select("name");
      if (skillsData) {
        setAvailableSkills(skillsData.map((s) => s.name));
      }
    }
    loadSkillsAndUser();
  }, []);

  useEffect(() => {
    async function executeSearch() {
      setIsLoading(true);
      const res = await searchJobs({
        query,
        job_type: jobType,
        location,
        is_remote: isRemote,
        skills: selectedSkills,
        page,
        pageSize: 6,
      });

      setJobs(res.data);
      setTotalCount(res.count);
      setIsLoading(false);
    }

    executeSearch();
  }, [query, jobType, location, isRemote, selectedSkills, page]);

  function toggleSkill(skill: string) {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
    setPage(1);
  }

  async function handleSaveSearch() {
    if (!userId) {
      alert("Please sign in as a student to save search alerts.");
      return;
    }

    try {
      await saveSearchFilter(userId, `Search: ${query || "All Jobs"} (${location || "Anywhere"})`, {
        query,
        jobType,
        location,
        isRemote,
        skills: selectedSkills,
      });
      setSaveStatus("Search filter saved to your job alerts!");
      setTimeout(() => setSaveStatus(null), 4000);
    } catch (err: any) {
      alert(`Failed to save search: ${err.message}`);
    }
  }

  const totalPages = Math.ceil(totalCount / 6);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 container py-8">
        {/* Search Header */}
        <div className="bg-gradient-to-r from-primary/10 via-background to-accent/10 border rounded-2xl p-6 md:p-8 mb-8">
          <h1 className="text-3xl font-extrabold mb-2">Explore Tech Jobs in India</h1>
          <p className="text-muted-foreground text-sm mb-6">
            Powered by Postgres Full-Text Search and skill-matching algorithms.
          </p>

          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Search by job title, description, or keyword (e.g. Next.js, AI, Full-Stack)..."
                className="w-full h-11 pl-10 pr-4 rounded-lg border text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="relative w-full md:w-64">
              <MapPin className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                  setPage(1);
                }}
                placeholder="City or state (e.g. Bengaluru)..."
                className="w-full h-11 pl-10 pr-4 rounded-lg border text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {userId && (
              <button
                onClick={handleSaveSearch}
                className="inline-flex items-center justify-center gap-1.5 h-11 px-4 rounded-lg border bg-background hover:bg-accent font-semibold text-xs whitespace-nowrap"
              >
                <Bookmark className="h-4 w-4 text-primary" /> Save Search
              </button>
            )}
          </div>

          {saveStatus && (
            <div className="mt-3 text-xs text-emerald-800 bg-emerald-50 p-2 rounded-md border border-emerald-200">
              {saveStatus}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filter Sidebar */}
          <div className="space-y-6 bg-background border p-6 rounded-xl h-fit shadow-sm">
            <h2 className="font-bold text-base border-b pb-2">Filter Jobs</h2>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase mb-2">
                Job Type
              </label>
              <select
                value={jobType}
                onChange={(e) => {
                  setJobType(e.target.value);
                  setPage(1);
                }}
                className="w-full h-10 px-3 rounded-md border text-sm bg-background focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="all">All Job Types</option>
                <option value="full_time">Full Time</option>
                <option value="internship">Internship</option>
                <option value="part_time">Part Time</option>
                <option value="freelance">Freelance</option>
                <option value="gig">Gig / Contract</option>
              </select>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t">
              <input
                type="checkbox"
                id="searchRemote"
                checked={isRemote}
                onChange={(e) => {
                  setIsRemote(e.target.checked);
                  setPage(1);
                }}
                className="h-4 w-4 rounded border-input text-primary focus:ring-ring"
              />
              <label htmlFor="searchRemote" className="text-sm font-medium">
                Remote Positions Only
              </label>
            </div>

            <div className="pt-2 border-t">
              <label className="block text-xs font-semibold text-muted-foreground uppercase mb-2">
                Filter by Skills
              </label>
              <div className="flex flex-wrap gap-1.5">
                {availableSkills.map((skill) => {
                  const isSelected = selectedSkills.includes(skill);
                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSkill(skill)}
                      className={`text-xs px-2.5 py-1 rounded-full transition-colors ${
                        isSelected
                          ? "bg-primary text-primary-foreground font-semibold"
                          : "bg-muted hover:bg-accent text-muted-foreground"
                      }`}
                    >
                      {isSelected ? `✓ ${skill}` : `+ ${skill}`}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Jobs List Grid & Pagination */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing <span className="font-bold text-foreground">{totalCount}</span> open position(s)
              </div>
            </div>

            {isLoading ? (
              <div className="p-12 text-center text-muted-foreground">Searching jobs...</div>
            ) : jobs.length === 0 ? (
              <div className="p-12 border rounded-xl bg-muted/20 text-center space-y-3">
                <Briefcase className="h-10 w-10 text-muted-foreground mx-auto" />
                <h3 className="font-semibold text-base">No matching jobs found</h3>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  Try adjusting your full-text keywords or clearing skill filters.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {jobs.map((job) => (
                  <div
                    key={job.id}
                    className="p-6 border rounded-xl bg-background shadow-sm hover:border-primary/50 transition-colors space-y-3"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <Link href={`/jobs/${job.id}`} className="font-bold text-xl hover:text-primary transition-colors">
                          {job.title}
                        </Link>
                        <p className="text-sm text-muted-foreground font-medium">{job.companies?.name || "Verified Employer"}</p>
                      </div>

                      <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-semibold capitalize">
                        {job.job_type.replace("_", " ")}
                      </span>
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-2">{job.description}</p>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-2">
                      {job.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          <span>{job.location}</span>
                        </div>
                      )}
                      {job.min_salary && job.max_salary && (
                        <span className="font-semibold text-foreground">
                          ₹{job.min_salary.toLocaleString()} - ₹{job.max_salary.toLocaleString()} / year
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t">
                      <div className="flex flex-wrap gap-1.5">
                        {job.skills_required?.map((skill: string) => (
                          <span key={skill} className="text-xs px-2.5 py-0.5 rounded bg-muted font-medium">
                            {skill}
                          </span>
                        ))}
                      </div>

                      <Link
                        href={`/jobs/${job.id}`}
                        className="inline-flex items-center gap-1 px-4 py-2 rounded-md bg-primary text-primary-foreground font-semibold text-xs hover:bg-primary/90"
                      >
                        <span>View & Apply</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Server-Side Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 pt-6">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                  className="inline-flex items-center gap-1 h-9 px-3 rounded-md border text-xs font-semibold disabled:opacity-50"
                >
                  <ChevronLeft className="h-4 w-4" /> Previous
                </button>
                <span className="text-xs text-muted-foreground">
                  Page {page} of {totalPages}
                </span>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage(page + 1)}
                  className="inline-flex items-center gap-1 h-9 px-3 rounded-md border text-xs font-semibold disabled:opacity-50"
                >
                  Next <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
