import { AppShell } from "@/components/app-shell";
import { OnboardingForm } from "@/components/onboarding-form";

export default function OnboardingPage() {
  return (
    <AppShell
      title="Onboarding"
      subtitle="Capture the minimum profile data needed to personalize review and training. This hosted-friendly V1 uses browser-local storage instead of server file persistence."
    >
      <OnboardingForm />
    </AppShell>
  );
}
