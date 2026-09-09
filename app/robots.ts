import { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || "https://hackerzone.in";
const IS_PRODUCTION = process.env.NODE_ENV === "production" && (process.env.VERCEL_ENV === "production" || !process.env.VERCEL_ENV);

export default function robots(): MetadataRoute.Robots {
  if (!IS_PRODUCTION) {
    // Disallow indexing on preview branches, staging, and local dev
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin/",
        "/admin/*",
        "/company/",
        "/company/*",
        "/student/",
        "/student/*",
        "/institution/",
        "/institution/*",
        "/api/",
        "/api/*",
        "/app/",
        "/app/*",
        "/workspace/",
        "/workspace/*",
        "/settings/",
        "/settings/*",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
