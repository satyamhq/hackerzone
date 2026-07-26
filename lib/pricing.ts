export interface PricingTier {
  id: "basic" | "pro" | "enterprise";
  name: string;
  price: string;
  period: string;
  description: string;
  messageQuota: number;
  badge?: string;
  features: string[];
  ctaText: string;
  popular?: boolean;
}

export const PRICING_TIERS: Record<string, PricingTier> = {
  basic: {
    id: "basic",
    name: "Basic",
    price: "Free",
    period: "forever",
    description: "Essential hiring suite for early-stage tech startups and founders.",
    messageQuota: 50,
    features: [
      "Post unlimited active job listings",
      "50 outbound candidate messages / month",
      "Basic skill overlap candidate matching",
      "Standard applicant tracking pipeline",
      "Public company profile page",
    ],
    ctaText: "Get Started Free",
    popular: false,
  },
  pro: {
    id: "pro",
    name: "Pro Recruiter",
    price: "₹10,000",
    period: "per month",
    description: "Advanced candidate sourcing for growing AI engineering teams.",
    messageQuota: 250,
    badge: "Most Popular",
    features: [
      "Everything in Basic Plan",
      "250 outbound candidate messages / month",
      "Priority skill-matching algorithm ranking",
      "Direct campus event integration & fair hosting",
      "Export candidate applications CSV",
      "Verified Employer badge",
    ],
    ctaText: "Start Pro Plan",
    popular: true,
  },
  enterprise: {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    period: "tailored",
    description: "Full-scale university relations and high-volume campus hiring.",
    messageQuota: 999999,
    features: [
      "Unlimited outbound candidate messaging",
      "Exclusive university career center partnerships",
      "Custom branded virtual hackathons & job fairs",
      "Dedicated account manager & SLA",
      "Custom ATS API integration",
    ],
    ctaText: "Contact Sales",
    popular: false,
  },
};
