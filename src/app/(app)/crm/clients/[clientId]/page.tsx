import { ClientDetail } from "@/features/crm/crm-screens";

export default async function Page({ params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = await params;
  return <ClientDetail clientId={clientId} />;
}
