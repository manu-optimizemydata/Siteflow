"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useUiStore } from "@/stores/ui-store";
import { Shell } from "@/components/app-shell/shell";

export function AppShell({ children }: { children: ReactNode }) {
  const onboarded = useUiStore((state) => state.onboardingComplete);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!onboarded) router.replace("/");
  }, [onboarded, router, pathname]);

  if (!onboarded) return null;
  return <Shell>{children}</Shell>;
}
