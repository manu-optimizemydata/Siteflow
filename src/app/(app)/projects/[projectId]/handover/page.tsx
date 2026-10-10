import { HandoverScreen } from "@/features/projects/project-screens";

export default async function Page({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  return <HandoverScreen projectId={projectId} />;
}
