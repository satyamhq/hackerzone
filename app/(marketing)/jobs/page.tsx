"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { createClient } from "@/lib/supabase/client";
import { searchJobs, saveSearchFilter } from "@/lib/supabase/jobs";
import { Briefcase, Bookmark, ChevronLeft, ChevronRight, MapPin, Search, Sparkles, X, Check, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

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
    <div className="flex min-h-screen flex-col bg-[#FAFBFC]">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        {/* Search Header Banner */}
        <div className="rounded-3xl bg-slate-900 text-white p-8 md:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-3xl space-y-3 mb-8 relative z-10">
            <Badge variant="brand" className="bg-blue-500/20 text-blue-300 border-blue-400/30">
              Live Job Index
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              Explore Open Tech Positions
            </h1>
            <p className="text-sm text-slate-300">
              Powered by instant skill-matching algorithms and real-time database indexing across India.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 relative z-10">
            <div className="lg:col-span-6 relative">
              <Search className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Search by job title, stack (e.g. Next.js, PyTorch)..."
                className="w-full h-11 pl-11 pr-4 rounded-xl bg-slate-800/90 border border-slate-700 text-white placeholder:text-slate-400 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="lg:col-span-4 relative">
              <MapPin className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                  setPage(1);
                }}
                placeholder="City (e.g. Bengaluru, Remote)..."
                className="w-full h-11 pl-11 pr-4 rounded-xl bg-slate-800/90 border border-slate-700 text-white placeholder:text-slate-400 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            {userId && (
              <div className="lg:col-span-2">
                <Button
                  onClick={handleSaveSearch}
                  variant="secondary"
                  className="w-full h-11 justify-center gap-2 font-bold"
                >
                  <Bookmark className="h-4 w-4 text-blue-600" />
                  <span>Save Alert</span>
                </Button>
              </div>
            )}
          </div>

          {saveStatus && (
            <div className="mt-4 text-xs text-emerald-300 bg-emerald-950/60 p-3 rounded-xl border border-emerald-800/80 font-medium">
              {saveStatus}
            </div>
          )}
        </div>

        {/* Main Grid: Filters Sidebar + Job Cards List */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Filter Sidebar */}
          <div className="lg:col-span-4 space-y-6 bg-white p-6 rounded-3xl border border-slate-100 shadow-soft">
            <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
              <Filter className="h-4 w-4 text-blue-600" />
              <h2 className="font-extrabold text-slate-900 text-base">Filter Openings</h2>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                Job Type
              </label>
              <select
                value={jobType}
                onChange={(e) => {
                  setJobType(e.target.value);
                  setPage(1);
                }}
                className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm text-slate-900 bg-white focus:outline-none focus:border-blue-600"
              >
                <option value="all">All Job Types</option>
                <option value="full_time">Full Time</option>
                <option value="internship">Internship</option>
                <option value="part_time">Part Time</option>
                <option value="freelance">Freelance</option>
                <option value="gig">Gig / Contract</option>
              </select>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
              <input
                type="checkbox"
                id="searchRemote"
                checked={isRemote}
                onChange={(e) => {
                  setIsRemote(e.target.checked);
                  setPage(1);
                }}
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="searchRemote" className="text-xs font-semibold text-slate-700 cursor-pointer">
                Remote Positions Only
              </label>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-3">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                Required Technical Skills
              </label>
              <div className="flex flex-wrap gap-1.5">
                {availableSkills.map((skill) => {
                  const isSelected = selectedSkills.includes(skill);
                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSkill(skill)}
                      className={`text-xs px-3 py-1.5 rounded-full transition-all duration-150 font-semibold ${
                        isSelected
                          ? "bg-slate-900 text-white shadow-sm"
                          : "bg-slate-100 hover:bg-slate-200/80 text-slate-700"
                      }`}
                    >
                      {isSelected ? `✓ ${skill}` : `+ ${skill}`}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Job List & Skeleton Loader */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between">
              <div className="text-xs font-semibold text-slate-500">
                Showing <span className="font-extrabold text-slate-900">{totalCount}</span> open position(s)
              </div>
            </div>

            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="p-6 space-y-4">
                    <Skeleton className="h-6 w-2/3" />
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-16 w-full" />
                  </Card>
                ))}
              </div>
            ) : jobs.length === 0 ? (
              <Card className="p-12 text-center space-y-4">
                <Briefcase className="h-12 w-12 text-slate-400 mx-auto" />
                <h3 className="font-bold text-lg text-slate-900">No matching job listings found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try adjusting your search terms or clearing selected skill filters.
                </p>
              </Card>
            ) : (
              <div className="space-y-4">
                {jobs.map((job) => (
                  <Card key={job.id} hover className="p-6 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                      <div>
                        <Link
                          href={`/jobs/${job.id}`}
                          className="font-bold text-xl text-slate-900 hover:text-blue-600 transition-colors"
                        >
                          {job.title}
                        </Link>
                        <p className="text-xs font-bold text-slate-500 mt-0.5">
                          {job.companies?.name || "Verified Employer"}
                        </p>
                      </div>

                      <Badge variant="brand" className="w-fit capitalize">
                        {job.job_type.replace("_", " ")}
                      </Badge>
                    </div>

                    <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
                      {job.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                      {job.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-slate-400" />
                          <span>{job.location}</span>
                        </div>
                      )}
                      {job.min_salary && job.max_salary && (
                        <span className="font-bold text-emerald-600">
                          ₹{job.min_salary.toLocaleString()} - ₹{job.max_salary.toLocaleString()} / year
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-slate-100">
                      <div className="flex flex-wrap gap-1.5">
                        {job.skills_required?.map((skill: string) => (
                          <span
                            key={skill}
                            className="text-[11px] font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-700"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>

                      <Link href={`/jobs/${job.id}`}>
                        <Button variant="brand" size="sm">
                          View & Apply
                        </Button>
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 pt-6">
                <Button
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                  variant="outline"
                  size="sm"
                  className="gap-1"
                >
                  <ChevronLeft className="h-4 w-4" /> Previous
                </Button>
                <span className="text-xs font-semibold text-slate-500">
                  Page {page} of {totalPages}
                </span>
                <Button
                  disabled={page >= totalPages}
                  onClick={() => setPage(page + 1)}
                  variant="outline"
                  size="sm"
                  className="gap-1"
                >
                  Next <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
