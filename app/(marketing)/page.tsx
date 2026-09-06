import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { LandingClient } from "@/components/marketing/landing-client";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#14151C]">
      <Navbar />
      <main className="flex-1">
        <LandingClient />
      </main>
      <Footer />
    </div>
  );
}
