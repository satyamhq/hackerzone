import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hackerzone: the career network for the Indian AI economy",
  description:
    "The premier three-sided career network connecting engineering students, top tech employers, and university career centers across India.",
  keywords: [
    "Hackerzone",
    "India Tech Jobs",
    "AI Careers India",
    "Campus Hiring India",
    "Software Engineering Jobs",
    "University Career Center",
  ],
  openGraph: {
    title: "Hackerzone: the career network for the Indian AI economy",
    description:
      "Connecting students, employers, and institutions to accelerate tech careers across India.",
    url: "https://hackerzone.dev",
    siteName: "Hackerzone",
    locale: "en_IN",
    type: "website",
  },
};

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="min-h-screen flex flex-col">{children}</div>;
}
