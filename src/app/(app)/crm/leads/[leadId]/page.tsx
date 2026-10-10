import { LeadDetail } from "@/features/crm/crm-screens";
import { leadStaticParams } from "@/lib/static-params";

export function generateStaticParams() {
  return leadStaticParams();
}

export default async function Page({ params }: { params: Promise<{ leadId: string }> }) {
  const { leadId } = await params;
  return <LeadDetail leadId={leadId} />;
}
