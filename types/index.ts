export type UserRole = "student" | "employer" | "institution_admin" | "admin";

export interface Profile {
  id: string;
  email: string;
  role: UserRole;
  fullName: string | null;
  avatarUrl: string | null;
  createdAt: string;
}
