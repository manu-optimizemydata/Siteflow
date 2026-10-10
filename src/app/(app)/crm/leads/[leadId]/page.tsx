import { LeadDetail } from "@/features/crm/crm-screens";

export default async function Page({ params }: { params: Promise<{ leadId: string }> }) {
  const { leadId } = await params;
  return <LeadDetail leadId={leadId} />;
}
