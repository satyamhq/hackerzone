export * from "./database.types";

import type { Database, UserRole, ProfileVisibility } from "./database.types";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Skill = Database["public"]["Tables"]["skills"]["Row"];
export type UserSkill = Database["public"]["Tables"]["user_skills"]["Row"];
export type Challenge = Database["public"]["Tables"]["challenges"]["Row"];
export type Submission = Database["public"]["Tables"]["submissions"]["Row"];
export type Campus = Database["public"]["Tables"]["campuses"]["Row"];
export type CampusMember = Database["public"]["Tables"]["campus_members"]["Row"];
export type Company = Database["public"]["Tables"]["companies"]["Row"];
export type CompanyMember = Database["public"]["Tables"]["company_members"]["Row"];
export type Job = Database["public"]["Tables"]["jobs"]["Row"];
export type Application = Database["public"]["Tables"]["applications"]["Row"];
export type Event = Database["public"]["Tables"]["events"]["Row"];
export type EventRsvp = Database["public"]["Tables"]["event_rsvps"]["Row"];
export type MessageThread = Database["public"]["Tables"]["message_threads"]["Row"];
export type Message = Database["public"]["Tables"]["messages"]["Row"];
export type Mentor = Database["public"]["Tables"]["mentors"]["Row"];
export type MentorBooking = Database["public"]["Tables"]["mentor_bookings"]["Row"];
export type Resource = Database["public"]["Tables"]["resources"]["Row"];
export type Report = Database["public"]["Tables"]["reports"]["Row"];
export type AuditLog = Database["public"]["Tables"]["audit_logs"]["Row"];
export type Subscription = Database["public"]["Tables"]["subscriptions"]["Row"];
