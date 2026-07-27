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
        {/* HANDSHAKE DARK HERO SECTION */}
        <section className="relative py-20 lg:py-28 handshake-hero-mesh text-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/15 backdrop-blur-md text-xs font-extrabold uppercase tracking-widest text-[#D3FB52]">
              <Building2 className="h-4 w-4 text-[#D3FB52]" />
              <span>HIRE EARLY TALENT & AI SPECIALISTS</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto uppercase leading-tight text-white">
              HIRE TOP ENGINEERING & AI TALENT ACROSS <span className="text-gradient-lime">INDIA</span>
            </h1>

            <p className="text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto font-medium">
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
                    ? "border-2 border-[#D3FB52] shadow-2xl ring-4 ring-[#D3FB52]/20 bg-slate-900 text-white"
                    : "border-slate-200/80 bg-white"
                }`}
              >
                {tier.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#D3FB52] text-[#052326] text-[11px] font-extrabold uppercase tracking-wider shadow-md">
                    {tier.badge}
                  </div>
                )}

                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className={`text-2xl font-bold ${tier.popular ? "text-white" : "text-slate-900"}`}>{tier.name}</h3>
                    <p className={`text-xs leading-relaxed ${tier.popular ? "text-slate-300" : "text-slate-500"}`}>{tier.description}</p>
                  </div>

                  <div className="flex items-baseline gap-1.5 pt-2 border-t border-slate-100/20">
                    <span className={`text-4xl lg:text-5xl font-extrabold ${tier.popular ? "text-[#D3FB52]" : "text-slate-900"}`}>{tier.price}</span>
                    <span className={`text-xs font-semibold ${tier.popular ? "text-slate-400" : "text-slate-500"}`}>/ {tier.period}</span>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-slate-100/20">
                    {tier.features.map((feat, idx) => (
                      <div key={idx} className={`flex items-start gap-3 text-xs ${tier.popular ? "text-slate-200" : "text-slate-700"}`}>
                        <div className={`p-1 rounded-full shrink-0 mt-0.5 ${tier.popular ? "bg-[#D3FB52]/20 text-[#D3FB52]" : "bg-blue-50 text-blue-600"}`}>
                          <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                        </div>
                        <span className="leading-snug">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100/20">
                  <Link href="/sign-up">
                    <Button
                      variant={tier.popular ? "lime" : "outline"}
                      className={`w-full justify-center shadow-sm font-extrabold ${tier.popular ? "text-[#052326]" : ""}`}
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
