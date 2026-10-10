import { QuotationDetail } from "@/features/crm/crm-screens";

export default async function Page({ params }: { params: Promise<{ quotationId: string }> }) {
  const { quotationId } = await params;
  return <QuotationDetail quotationId={quotationId} />;
}
