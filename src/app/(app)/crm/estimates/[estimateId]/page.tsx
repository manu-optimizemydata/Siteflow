import { EstimateDetail } from "@/features/crm/crm-screens";
import { estimateStaticParams } from "@/lib/static-params";

export function generateStaticParams() {
  return estimateStaticParams();
}

export default async function Page({ params }: { params: Promise<{ estimateId: string }> }) {
  const { estimateId } = await params;
  return <EstimateDetail estimateId={estimateId} />;
}
