import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Hackerzone: The Career Network for the Indian AI Economy",
  description:
    "The largest expert network for learning, earning, and growing careers in the AI economy — giving everyone an accessible first step into an AI-powered career.",
});

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="min-h-screen flex flex-col">{children}</div>;
}
