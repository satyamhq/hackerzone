import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://hackerzone.in";
const SITE_NAME = "Hackerzone";
const DEFAULT_TITLE = "Hackerzone: The Career Network for the Indian AI Economy";
const DEFAULT_DESCRIPTION =
  "The largest expert network for learning, earning, and growing careers in the AI economy — giving everyone an accessible first step into an AI-powered career.";

interface BuildMetadataOptions {
  title?: string;
  description?: string;
  path?: string;
  ogImage?: string;
  noIndex?: boolean;
}

/**
 * Shared metadata builder per §7.
 * Every page should use this instead of hand-rolling <head> tags.
 */
export function buildMetadata(options: BuildMetadataOptions = {}): Metadata {
  const {
    title = DEFAULT_TITLE,
    description = DEFAULT_DESCRIPTION,
    path = "",
    ogImage = "/og-image.png",
    noIndex = false,
  } = options;

  const url = `${SITE_URL}${path}`;

  return {
    title,
    description,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type: "website",
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
    },
    ...(noIndex && {
      robots: { index: false, follow: false },
    }),
  };
}
