import { QuotationDetail } from "@/features/crm/crm-screens";
import { quotationStaticParams } from "@/lib/static-params";

export function generateStaticParams() {
  return quotationStaticParams();
}

export default async function Page({ params }: { params: Promise<{ quotationId: string }> }) {
  const { quotationId } = await params;
  return <QuotationDetail quotationId={quotationId} />;
}
