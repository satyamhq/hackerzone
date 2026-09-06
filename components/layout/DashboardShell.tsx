// Dashboard shell layout component — wraps all authenticated dashboard pages
// TODO: Phase 3 — Implement with sidebar nav, role-based menu items
export function DashboardShell({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-[#0A0A0A]">{children}</div>;
}
