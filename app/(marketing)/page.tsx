import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { LandingClient } from "@/components/marketing/landing-client";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#0A0A0A] text-[#F5F5F5]">
      <Navbar />
      <main className="flex-1">
        <LandingClient />
      </main>
      <Footer />
    </div>
  );
}
