import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";

export default function InstitutionOnboardingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container py-10 max-w-2xl">
        <h1 className="text-3xl font-bold mb-2">Institution Onboarding</h1>
        <p className="text-muted-foreground mb-6">
          Verify your institution details and campus domain.
        </p>
      </main>
      <Footer />
    </div>
  );
}
