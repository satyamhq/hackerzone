import { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || "https://hackerzone.in";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const publicRoutes = [
    { url: `${SITE_URL}`, priority: 1.0, changeFrequency: "daily" as const },
    { url: `${SITE_URL}/experts`, priority: 0.9, changeFrequency: "daily" as const },
    { url: `${SITE_URL}/projects`, priority: 0.9, changeFrequency: "daily" as const },
    { url: `${SITE_URL}/solutions`, priority: 0.8, changeFrequency: "weekly" as const },
    { url: `${SITE_URL}/resources`, priority: 0.8, changeFrequency: "weekly" as const },
    { url: `${SITE_URL}/about`, priority: 0.7, changeFrequency: "monthly" as const },
    { url: `${SITE_URL}/careers`, priority: 0.7, changeFrequency: "weekly" as const },
    { url: `${SITE_URL}/contact`, priority: 0.7, changeFrequency: "monthly" as const },
    { url: `${SITE_URL}/pricing`, priority: 0.8, changeFrequency: "weekly" as const },
    { url: `${SITE_URL}/jobs`, priority: 0.8, changeFrequency: "daily" as const },
    { url: `${SITE_URL}/challenges`, priority: 0.8, changeFrequency: "weekly" as const },
    { url: `${SITE_URL}/events`, priority: 0.8, changeFrequency: "weekly" as const },
    { url: `${SITE_URL}/login`, priority: 0.5, changeFrequency: "monthly" as const },
    { url: `${SITE_URL}/signup`, priority: 0.6, changeFrequency: "monthly" as const },
    { url: `${SITE_URL}/privacy`, priority: 0.4, changeFrequency: "monthly" as const },
    { url: `${SITE_URL}/terms`, priority: 0.4, changeFrequency: "monthly" as const },
  ];

  return publicRoutes.map((route) => ({
    url: route.url,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
