import Link from "next/link";
import { Briefcase } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-muted/30 py-12">
      <div className="container flex flex-col md:flex-row items-start justify-between gap-8">
        <div className="space-y-3 max-w-sm">
          <div className="flex items-center gap-2 font-bold text-xl text-primary">
            <Briefcase className="h-6 w-6" />
            <span>Hackerzone</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            The three-sided career network for the Indian AI economy connecting students, employers, and university career centers.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-xs">
          <div className="space-y-2">
            <div className="font-bold text-foreground uppercase tracking-wider">Ecosystem</div>
            <ul className="space-y-1.5 text-muted-foreground">
              <li>
                <Link href="/for-students" className="hover:text-foreground transition-colors">
                  For Students
                </Link>
              </li>
              <li>
                <Link href="/for-employers" className="hover:text-foreground transition-colors">
                  For Employers
                </Link>
              </li>
              <li>
                <Link href="/for-institutions" className="hover:text-foreground transition-colors">
                  For Institutions
                </Link>
              </li>
              <li>
                <Link href="/jobs" className="hover:text-foreground transition-colors">
                  Explore Jobs
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <div className="font-bold text-foreground uppercase tracking-wider">Account</div>
            <ul className="space-y-1.5 text-muted-foreground">
              <li>
                <Link href="/sign-in" className="hover:text-foreground transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/sign-up" className="hover:text-foreground transition-colors">
                  Sign Up
                </Link>
              </li>
              <li>
                <Link href="/forgot-password" className="hover:text-foreground transition-colors">
                  Reset Password
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <div className="font-bold text-foreground uppercase tracking-wider">Legal</div>
            <ul className="space-y-1.5 text-muted-foreground">
              <li>
                <Link href="/privacy" className="hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="container mt-8 pt-6 border-t text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Hackerzone Technologies India. All rights reserved.
      </div>
    </footer>
  );
}
