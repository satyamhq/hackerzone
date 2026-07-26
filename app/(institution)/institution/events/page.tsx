"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { createClient } from "@/utils/supabase/client";
import {
  getInstitutionAdmin,
  getInstitutionEvents,
  createInstitutionEvent,
} from "@/lib/supabase/institutions";
import { ArrowLeft, Calendar, Plus, Users } from "lucide-react";

export default function InstitutionEventsPage() {
  const [institutionId, setInstitutionId] = useState<string | null>(null);
  const [events, setEvents] = useState<any[]>([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventType, setEventType] = useState<"career_fair" | "workshop" | "info_session">("career_fair");
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [isVirtual, setIsVirtual] = useState(false);
  const [location, setLocation] = useState("Main Campus Auditorium");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadEventsData() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const adminData = await getInstitutionAdmin(user.id);
        if (adminData?.institution_id) {
          setInstitutionId(adminData.institution_id);
          const list = await getInstitutionEvents(adminData.institution_id);
          setEvents(list);
        }
      }
      setIsLoading(false);
    }

    loadEventsData();
  }, []);

  async function handleCreateEvent(e: React.FormEvent) {
    e.preventDefault();
    if (!institutionId) return;

    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      const newEvent = await createInstitutionEvent(institutionId, {
        title,
        description,
        event_type: eventType,
        starts_at: new Date(startsAt).toISOString(),
        ends_at: new Date(endsAt).toISOString(),
        is_virtual: isVirtual,
        location,
      });

      setEvents([...events, newEvent]);
      setStatusMessage({
        type: "success",
        text: "Event created successfully! It is now live and surfaced on student dashboards for registration.",
      });

      setTitle("");
      setDescription("");
    } catch (err: any) {
      setStatusMessage({ type: "error", text: err.message || "Failed to create event." });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 container py-10 flex items-center justify-center">
          <p className="text-muted-foreground">Loading campus events...</p>
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
          <Link href="/institution/dashboard" className="p-2 rounded-md border hover:bg-accent text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Campus Events Manager</h1>
            <p className="text-xs text-muted-foreground">Schedule career fairs, technical workshops, and employer info sessions.</p>
          </div>
        </div>

        {statusMessage && (
          <div
            className={`p-4 mb-6 text-xs rounded-md border ${
              statusMessage.type === "success"
                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                : "bg-destructive/10 text-destructive border-destructive/20"
            }`}
          >
            {statusMessage.text}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Create Event Form */}
          <div className="lg:col-span-1 bg-background border rounded-xl p-6 shadow-sm space-y-4">
            <h2 className="font-bold text-base border-b pb-2 flex items-center gap-2">
              <Plus className="h-4 w-4 text-primary" /> Schedule New Event
            </h2>

            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div>
                <label className="block text-xs font-medium mb-1">Event Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Annual Tech Placement Fair 2026"
                  className="w-full h-9 px-3 rounded-md border text-xs focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1">Event Category</label>
                <select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value as any)}
                  className="w-full h-9 px-3 rounded-md border text-xs bg-background focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  <option value="career_fair">Career Fair</option>
                  <option value="workshop">Technical Workshop</option>
                  <option value="info_session">Employer Info Session</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1">Start Date & Time</label>
                <input
                  type="datetime-local"
                  required
                  value={startsAt}
                  onChange={(e) => setStartsAt(e.target.value)}
                  className="w-full h-9 px-3 rounded-md border text-xs focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1">End Date & Time</label>
                <input
                  type="datetime-local"
                  required
                  value={endsAt}
                  onChange={(e) => setEndsAt(e.target.value)}
                  className="w-full h-9 px-3 rounded-md border text-xs focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1">Venue Location</label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Campus Auditorium or Zoom Link"
                  className="w-full h-9 px-3 rounded-md border text-xs focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isVirt"
                  checked={isVirtual}
                  onChange={(e) => setIsVirtual(e.target.checked)}
                  className="h-4 w-4 rounded border-input text-primary focus:ring-ring"
                />
                <label htmlFor="isVirt" className="text-xs font-medium">
                  Virtual / Online Event
                </label>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Details for participating students and recruiting employers..."
                  className="w-full p-2.5 rounded-md border text-xs focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-9 rounded-md bg-primary text-primary-foreground font-semibold text-xs hover:bg-primary/90 disabled:opacity-50"
              >
                {isSubmitting ? "Creating..." : "Publish Event"}
              </button>
            </form>
          </div>

          {/* Events List */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="font-bold text-base flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" /> Active Campus Events ({events.length})
            </h2>

            {events.length === 0 ? (
              <div className="p-12 border rounded-lg bg-muted/20 text-center space-y-2">
                <p className="text-xs text-muted-foreground">No events scheduled yet. Create one using the form.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {events.map((ev) => (
                  <div key={ev.id} className="p-5 border rounded-lg bg-background shadow-sm space-y-2">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-base">{ev.title}</h3>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-semibold capitalize">
                        {ev.event_type.replace("_", " ")}
                      </span>
                    </div>

                    <p className="text-xs text-muted-foreground">{ev.description}</p>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t">
                      <span>{new Date(ev.starts_at).toLocaleDateString()}</span>
                      <span>Location: {ev.location || "Virtual"}</span>
                      <span className="font-semibold text-foreground">
                        {ev.event_registrations?.[0]?.count || 0} Registered Student(s)
                      </span>
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
