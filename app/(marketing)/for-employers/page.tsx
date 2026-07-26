import Link from "next/link";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { PRICING_TIERS } from "@/lib/pricing";
import { Building2, Check, Zap } from "lucide-react";

export default function ForEmployersPage() {
  const tiers = Object.values(PRICING_TIERS);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 container py-16 max-w-6xl">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-bold bg-primary/10 text-primary">
            <Building2 className="h-4 w-4" />
            <span>Employer Pricing & Sourcing Plans</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Hire Top Engineering & AI Talent Across India
          </h1>
          <p className="text-muted-foreground text-base">
            Transparent pricing plans designed for early startups to enterprise university recruitment teams.
          </p>
        </div>

        {/* 3-Tier Pricing Grid (Single Source of Truth from lib/pricing.ts) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={`relative rounded-2xl border bg-background p-8 shadow-sm flex flex-col justify-between space-y-6 ${
                tier.popular ? "border-primary ring-2 ring-primary/20 shadow-md" : ""
              }`}
            >
              {tier.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider">
                  {tier.badge}
                </span>
              )}

              <div className="space-y-4">
                <h3 className="text-2xl font-bold">{tier.name}</h3>
                <p className="text-xs text-muted-foreground">{tier.description}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold">{tier.price}</span>
                  <span className="text-xs text-muted-foreground">/ {tier.period}</span>
                </div>

                <div className="pt-4 border-t space-y-3">
                  {tier.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs">
                      <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t">
                <Link
                  href="/sign-up"
                  className={`w-full inline-flex items-center justify-center h-11 rounded-lg font-bold text-sm transition-colors ${
                    tier.popular
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "border border-input bg-background hover:bg-accent"
                  }`}
                >
                  {tier.ctaText}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
