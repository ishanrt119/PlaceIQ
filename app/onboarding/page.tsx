import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { OnboardingForm } from "@/components/onboarding/onboarding-form";

export default async function OnboardingPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  if (session.user.isOnboarded) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
      <div className="max-w-3xl w-full bg-background rounded-xl border shadow-sm p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Complete Your Profile</h1>
          <p className="text-muted-foreground mt-2">
            Welcome, {session.user.name?.split(" ")[0]}! Let&apos;s get to know you better to help you find the right opportunities.
          </p>
        </div>
        <OnboardingForm />
      </div>
    </div>
  );
}
