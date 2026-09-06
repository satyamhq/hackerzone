# Hackerzone — Claude Code Project Guide

## What this is
Hackerzone: the career network for the Indian AI economy. Combines HackerRank-style
verified skill assessment, Handshake-style campus career network, and Mercor-style
algorithmic matching. Full spec: docs/HACKERZONE_COMPLETE.md.

## Stack
Next.js (App Router, TS) · Tailwind · Supabase (Postgres+RLS+Realtime+Storage) ·
Google OAuth · Vercel · Stripe/Razorpay

## Theme: Black & White (current — retired: any earlier navy/blue tokens)
bg: #0A0A0A | gradient: #1A1A1A → #4A4A4A → #0A0A0A | white: #FFFFFF |
body text: #F5F5F5 | secondary text: #A3A3A3 | border: #3F3F3F
Display font: Anton/Archivo Black, italic-slanted, all-caps, condensed | UI font: Inter
Full spec + hero pattern + component styles: docs/HACKERZONE_COMPLETE.md §6

## Assets already supplied
- Logo: public/logo/hackerzone-logo.png (white wordmark, transparent bg) —
  DO NOT re-request or regenerate this
- Still outstanding: favicon.ico, apple-touch-icon.png, og-image.png —
  leave marked TODO placeholders

## Read before starting any phase
docs/HACKERZONE_COMPLETE.md — the entire spec (architecture, workflows, design
system, schema, directory structure, phases, security, deployment, performance)

## Conventions
- Route groups: (marketing), (student), (employer), (campus-admin), (admin)
- All DB access through lib/supabase/{client,server}.ts — never raw fetch to Supabase REST
- Every table gets RLS + policies in the SAME migration that creates it
- service_role key is server-only, never in client-exposed code — grep build output to confirm
- Metadata for every page via lib/metadata.ts buildMetadata() helper
- Untrusted code (Skill Arena submissions) only runs in the isolated sandbox
  described in §11.4 — never inline in the app server
- Marketing homepage hero = gradient background + bold italic headline +
  search-bar-as-CTA + filter pills, per §6.5 — not a two-button hero
- Update docs/phase-log.md after completing each phase

## Do not
- Do not build features outside the current phase — flag if something seems
  missing, don't silently add it
- Do not skip RLS policies "for now"
- Do not hardcode design tokens — reference tailwind.config.ts theme extensions
- Do not introduce color accents into the marketing surface — strict grayscale
- Do not fabricate favicon/OG image assets — leave marked placeholder slots
  (logo is already done, don't touch it)
- Do not write destructive migrations without a backward-compatible path