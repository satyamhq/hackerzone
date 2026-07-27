import Link from "next/link";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { PRICING_TIERS } from "@/lib/pricing";
import { Building2, Check, Zap, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ForEmployersPage() {
  const tiers = Object.values(PRICING_TIERS);

  return (
    <div className="flex min-h-screen flex-col bg-[#FAFBFC]">
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative py-20 lg:py-28 bg-radial-glow overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
            <Badge variant="brand" className="px-4 py-1.5 shadow-sm">
              <Building2 className="h-4 w-4 text-blue-600 mr-1.5" />
              <span>Employer Hiring & Sourcing Suite</span>
            </Badge>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight">
              Hire Top Engineering & AI Talent Across <span className="text-gradient">India</span>
            </h1>

            <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Target verified campus developers, filter applicants by exact technical skill overlap, and streamline your recruitment pipeline.
            </p>
          </div>
        </section>

        {/* 3-TIER PRICING GRID */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {tiers.map((tier) => (
              <Card
                key={tier.id}
                hover
                className={`relative flex flex-col justify-between p-8 space-y-8 ${
                  tier.popular
                    ? "border-2 border-blue-600 shadow-2xl shadow-blue-500/10 ring-4 ring-blue-500/10"
                    : "border-slate-200/80"
                }`}
              >
                {tier.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[11px] font-extrabold uppercase tracking-wider shadow-md">
                    {tier.badge}
                  </div>
                )}

                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-slate-900">{tier.name}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{tier.description}</p>
                  </div>

                  <div className="flex items-baseline gap-1.5 pt-2 border-t border-slate-100">
                    <span className="text-4xl lg:text-5xl font-extrabold text-slate-900">{tier.price}</span>
                    <span className="text-xs font-semibold text-slate-500">/ {tier.period}</span>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-slate-100">
                    {tier.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-3 text-xs text-slate-700">
                        <div className="p-1 rounded-full bg-blue-50 text-blue-600 shrink-0 mt-0.5">
                          <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                        </div>
                        <span className="leading-snug">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100">
                  <Link href="/sign-up">
                    <Button
                      variant={tier.popular ? "brand" : "outline"}
                      className="w-full justify-center shadow-sm font-bold"
                    >
                      {tier.ctaText}
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
