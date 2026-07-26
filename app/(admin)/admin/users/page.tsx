"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { createClient } from "@/utils/supabase/client";
import { searchAdminUsers, toggleUserDeactivation } from "@/lib/supabase/admin";
import { ArrowLeft, Search, UserCheck, UserX, Users } from "lucide-react";

export default function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [usersList, setUsersList] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadUsers() {
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

        if (profile?.role === "admin") {
          setIsAdmin(true);
          const list = await searchAdminUsers("");
          setUsersList(list);
        }
      }
      setIsLoading(false);
    }

    loadUsers();
  }, []);

  async function handleSearch(term: string) {
    setSearchTerm(term);
    const results = await searchAdminUsers(term);
    setUsersList(results);
  }

  async function handleToggleStatus(userId: string, currentlyDeactivated: boolean) {
    try {
      const targetDeactivate = !currentlyDeactivated;
      await toggleUserDeactivation(userId, targetDeactivate);
      setUsersList((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, deactivated_at: targetDeactivate ? new Date().toISOString() : null } : u
        )
      );
      setStatusMessage(`User account ${targetDeactivate ? "deactivated" : "reactivated"}.`);
      setTimeout(() => setStatusMessage(null), 4000);
    } catch (err: any) {
      alert(`Error updating user: ${err.message}`);
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 container py-10 flex items-center justify-center">
          <p className="text-muted-foreground">Loading user directory...</p>
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
            <h1 className="text-2xl font-bold">User Account Management</h1>
            <p className="text-xs text-muted-foreground">Search platform users and manage account status.</p>
          </div>
        </div>

        {statusMessage && (
          <div className="p-3 mb-6 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-md">
            {statusMessage}
          </div>
        )}

        <div className="bg-background border rounded-xl p-6 shadow-sm space-y-6">
          <div className="relative">
            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search user profiles by name..."
              className="w-full h-11 pl-10 pr-4 rounded-lg border text-sm focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>

          <div className="space-y-3">
            {usersList.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-6">No users matching search terms.</p>
            ) : (
              usersList.map((userProf) => {
                const isDeactivated = Boolean(userProf.deactivated_at);
                return (
                  <div key={userProf.id} className="p-4 border rounded-lg flex items-center justify-between gap-4">
                    <div>
                      <div className="font-bold text-sm flex items-center gap-2">
                        {userProf.full_name || "User Profile"}
                        <span className="text-[10px] px-2 py-0.5 rounded bg-primary/10 text-primary font-semibold capitalize">
                          {userProf.role.replace("_", " ")}
                        </span>
                        {isDeactivated && (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-destructive/10 text-destructive font-semibold">
                            Deactivated
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">Joined {new Date(userProf.created_at).toLocaleDateString()}</div>
                    </div>

                    <button
                      onClick={() => handleToggleStatus(userProf.id, isDeactivated)}
                      className={`px-3 py-1.5 rounded text-xs font-semibold ${
                        isDeactivated
                          ? "bg-primary text-primary-foreground hover:bg-primary/90"
                          : "border text-destructive hover:bg-destructive/10"
                      }`}
                    >
                      {isDeactivated ? "Reactivate Account" : "Deactivate Account"}
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
