import { ClientDetail } from "@/features/crm/crm-screens";
import { clientStaticParams } from "@/lib/static-params";

export function generateStaticParams() {
  return clientStaticParams();
}

export default async function Page({ params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = await params;
  return <ClientDetail clientId={clientId} />;
}
