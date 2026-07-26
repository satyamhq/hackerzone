import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";

export default function StudentOnboardingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container py-10 max-w-2xl">
        <h1 className="text-3xl font-bold mb-2">Student Onboarding</h1>
        <p className="text-muted-foreground mb-6">
          Complete your profile details to unlock personalized job recommendations.
        </p>
      </main>
      <Footer />
    </div>
  );
}
