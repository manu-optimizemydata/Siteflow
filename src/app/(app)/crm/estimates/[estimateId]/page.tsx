import { EstimateDetail } from "@/features/crm/crm-screens";

export default async function Page({ params }: { params: Promise<{ estimateId: string }> }) {
  const { estimateId } = await params;
  return <EstimateDetail estimateId={estimateId} />;
}
