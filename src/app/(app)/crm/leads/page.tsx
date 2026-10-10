"use client";

import { Suspense } from "react";
import { LeadsScreen } from "@/features/crm/crm-screens";
import { PageSkeleton } from "@/components/ui/skeleton";

export default function Page() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <LeadsScreen />
    </Suspense>
  );
}
