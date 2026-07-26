import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";

export default function EmployerOnboardingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container py-10 max-w-2xl">
        <h1 className="text-3xl font-bold mb-2">Employer Onboarding</h1>
        <p className="text-muted-foreground mb-6">
          Set up your company profile and start posting jobs.
        </p>
      </main>
      <Footer />
    </div>
  );
}
