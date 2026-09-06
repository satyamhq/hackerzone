import { NextResponse } from "next/server";

// TODO: Phase 12 — Implement billing webhook (Stripe/Razorpay signature verification)
export async function POST() {
  return NextResponse.json({ error: "Not implemented" }, { status: 501 });
}
