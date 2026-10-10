"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { OnboardingScreen } from "@/features/onboarding/onboarding-screen";
import { homeForRole } from "@/lib/navigation";
import { useUiStore } from "@/stores/ui-store";

export default function HomePage() {
  const onboarded = useUiStore((state) => state.onboardingComplete);
  const role = useUiStore((state) => state.role);
  const router = useRouter();

  useEffect(() => {
    if (onboarded) router.replace(homeForRole(role));
  }, [onboarded, role, router]);

  if (onboarded) return null;
  return <OnboardingScreen />;
}
