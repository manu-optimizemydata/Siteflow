import { ProjectFrame } from "@/features/projects/project-screens";
import { projectStaticParams } from "@/lib/static-params";

export function generateStaticParams() {
  return projectStaticParams();
}

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  return <ProjectFrame projectId={projectId}>{children}</ProjectFrame>;
}
