"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { EmptyState, ErrorState, Money, PageHeader, Panel, StatusPill } from "@/components/data-display/bits";
import { Button } from "@/components/ui/button";
import { Drawer } from "@/components/ui/drawer";
import { Field, Input, Select, TextArea } from "@/components/ui/fields";
import { PageSkeleton } from "@/components/ui/skeleton";
import { useDatabase } from "@/components/providers";
import { displayMilestoneStatus, projectProgress } from "@/lib/calculations";
import { formatDate } from "@/lib/dates";
import { formatPercent, labelize } from "@/lib/format";
import { can, demoPersonByRole } from "@/lib/navigation";
import { projectFormSchema, type ProjectFormValues } from "@/lib/validation";
import { createProject, setHandoverItem, updateMilestone, updateProjectStatus } from "@/services/actions";
import { categoryCosts, projectFacts } from "@/services/summaries";
import { useUiStore } from "@/stores/ui-store";
import type { ProjectStatus } from "@/types/project";

function actorId() {
  return demoPersonByRole[useUiStore.getState().role];
}

export function ProjectsScreen() {
  const query = useDatabase();
  const [q, setQ] = useState("");
  const [health, setHealth] = useState("all");
  const [mode, setMode] = useState<"list" | "cards">("cards");
  if (query.isLoading) return <PageSkeleton />;
  if (!query.data) return <ErrorState message="Projects could not be loaded." onRetry={() => void query.refetch()} />;
  const facts = query.data.projects.map((project) => projectFacts(query.data!, project)).filter((item) => {
    const blob = `${item.project.name} ${item.project.code} ${item.clientName} ${item.project.location.area}`.toLowerCase();
    return blob.includes(q.toLowerCase()) && (health === "all" || item.health === health);
  });
  return (
    <div>
      <PageHeader title="Project portfolio" description="Progress is the weighted milestone average. Health comes from late milestones, open high issues, and budget overrun." actions={can(useUiStore.getState().role, "projects.create") ? <Link href="/projects/new" className="inline-flex h-11 items-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground">Create project</Link> : null} />
      <div className="mb-4 flex flex-wrap gap-2">
        <Input aria-label="Search projects" value={q} onChange={(event) => setQ(event.target.value)} placeholder="Search" className="max-w-xs" />
        <Select aria-label="Health" value={health} onChange={(event) => setHealth(event.target.value)} className="w-auto">
          <option value="all">All health</option>
          <option value="on_track">On track</option>
          <option value="at_risk">At risk</option>
          <option value="delayed">Delayed</option>
          <option value="completed">Completed</option>
        </Select>
        <Button variant={mode === "cards" ? "primary" : "outline"} onClick={() => setMode("cards")}>Cards</Button>
        <Button variant={mode === "list" ? "primary" : "outline"} onClick={() => setMode("list")}>List</Button>
      </div>
      {facts.length === 0 ? <EmptyState title="No projects" body="Adjust the filters or create one." /> : mode === "cards" ? (
        <ul className="grid gap-3 md:grid-cols-2">
          {facts.map((item) => (
            <li key={item.project.id}>
              <Link href={`/projects/${item.project.id}`} className="block overflow-hidden rounded-2xl border border-border bg-card">
                <div className="h-28 bg-cover bg-center" style={{ backgroundImage: `linear-gradient(180deg,transparent,rgba(20,38,30,.55)), url(${item.project.image})` }} />
                <div className="space-y-2 p-4">
                  <div className="flex items-start justify-between gap-2"><h2 className="font-semibold">{item.project.name}</h2><StatusPill status={item.health} /></div>
                  <p className="text-sm text-muted-foreground">{item.clientName} · {item.project.location.area} · {item.managerName}</p>
                  <p className="text-sm">{formatPercent(item.progress)} complete · next {item.nextMilestoneTitle}</p>
                  <p className="text-sm">Contract <Money value={item.project.contractValue} /></p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <ul className="divide-y divide-border rounded-2xl border border-border bg-card">
          {facts.map((item) => <li key={item.project.id}><Link className="grid gap-1 px-4 py-3 md:grid-cols-4" href={`/projects/${item.project.id}`}><span className="font-semibold">{item.project.code}</span><span>{item.project.name}</span><span className="text-sm">{formatPercent(item.progress)}</span><StatusPill status={item.health} /></Link></li>)}
        </ul>
      )}
    </div>
  );
}

export function NewProjectScreen() {
  const router = useRouter();
  const query = useDatabase();
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: { name: "", code: "ARH-NEW-02", clientId: "", type: "villa", area: "", city: "Bengaluru", managerId: "user_kavya", siteEngineerId: "user_arjun", startDate: "2026-11-01", plannedEndDate: "2027-05-01", contractValue: 8000000, budget: 6500000, description: "New site opened from the portfolio." },
  });
  if (query.isLoading) return <PageSkeleton />;
  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Create project" description="Dates, client, manager, contract, and budget are required. A starter milestone set is added." crumbs={[{ href: "/projects", label: "Projects" }]} />
      <form className="space-y-3" onSubmit={form.handleSubmit(async (values) => {
        try {
          const id = await createProject(values, actorId());
          toast.success("Project created");
          router.push(`/projects/${id}`);
        } catch (error) {
          toast.error(error instanceof Error ? error.message : "Could not create the project");
        }
      })}>
        <Field label="Name" error={form.formState.errors.name?.message}><Input {...form.register("name")} /></Field>
        <Field label="Code" error={form.formState.errors.code?.message}><Input {...form.register("code")} /></Field>
        <Field label="Client" error={form.formState.errors.clientId?.message}><Select {...form.register("clientId")}><option value="">Choose</option>{(query.data?.clients ?? []).map((client) => <option key={client.id} value={client.id}>{client.name}</option>)}</Select></Field>
        <Field label="Type"><Select {...form.register("type")}><option value="villa">Villa</option><option value="apartment">Apartment</option><option value="independent_house">Independent house</option><option value="office_fitout">Office fit-out</option><option value="commercial">Commercial</option><option value="industrial">Industrial</option></Select></Field>
        <Field label="Area" error={form.formState.errors.area?.message}><Input {...form.register("area")} /></Field>
        <Field label="City"><Input {...form.register("city")} /></Field>
        <Field label="Manager"><Select {...form.register("managerId")}>{(query.data?.users ?? []).filter((user) => user.role === "project_manager").map((user) => <option key={user.id} value={user.id}>{user.name}</option>)}</Select></Field>
        <Field label="Site engineer"><Select {...form.register("siteEngineerId")}>{(query.data?.users ?? []).filter((user) => user.role === "site_engineer").map((user) => <option key={user.id} value={user.id}>{user.name}</option>)}</Select></Field>
        <Field label="Start"><Input type="date" {...form.register("startDate")} /></Field>
        <Field label="Planned completion" error={form.formState.errors.plannedEndDate?.message}><Input type="date" {...form.register("plannedEndDate")} /></Field>
        <Field label="Contract value"><Input type="number" {...form.register("contractValue")} /></Field>
        <Field label="Budget"><Input type="number" {...form.register("budget")} /></Field>
        <Field label="Description" error={form.formState.errors.description?.message}><TextArea {...form.register("description")} /></Field>
        <Button type="submit" disabled={form.formState.isSubmitting}>Save project</Button>
      </form>
    </div>
  );
}

const tabs = [
  ["", "Overview"],
  ["/schedule", "Schedule"],
  ["/site-reports", "Site reports"],
  ["/tasks", "Tasks"],
  ["/budget", "Budget"],
  ["/procurement", "Procurement"],
  ["/costs", "Expenses"],
  ["/invoices", "Invoices"],
  ["/documents", "Documents"],
  ["/team", "Team"],
  ["/activity", "Activity"],
  ["/handover", "Handover"],
];

export function ProjectFrame({ projectId, children }: { projectId: string; children: React.ReactNode }) {
  const query = useDatabase();
  const project = query.data?.projects.find((item) => item.id === projectId);
  if (query.isLoading) return <PageSkeleton />;
  if (!project || !query.data) return <EmptyState title="Project not found" body="This id is not in the demo company." action={<Link href="/projects">Portfolio</Link>} />;
  const facts = projectFacts(query.data, project);
  return (
    <div>
      <PageHeader eyebrow={project.code} title={project.name} description={`${facts.clientName} · ${project.location.area} · ${facts.managerName} · ${formatDate(project.startDate)} to ${formatDate(project.plannedEndDate)}`} crumbs={[{ href: "/projects", label: "Projects" }]} actions={<><StatusPill status={facts.health} /><StatusPill status={project.status} /></>} />
      <p className="mb-3 text-sm">{formatPercent(facts.progress)} from milestones · Contract <Money value={project.contractValue} /></p>
      <div className="mb-4 flex gap-2 overflow-x-auto">
        {tabs.map(([href, label]) => (
          <Link key={label} href={`/projects/${projectId}${href}`} className="inline-flex h-10 shrink-0 items-center rounded-full border border-border bg-card px-3 text-sm">{label}</Link>
        ))}
      </div>
      {children}
    </div>
  );
}

export function ProjectOverview({ projectId }: { projectId: string }) {
  const query = useDatabase();
  const db = query.data;
  const project = db?.projects.find((item) => item.id === projectId);
  if (!db || !project) return null;
  const facts = projectFacts(db, project);
  const reports = db.reports.filter((item) => item.projectId === projectId).slice(0, 3);
  const issues = db.issues.filter((item) => item.projectId === projectId && item.status !== "resolved");
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Panel title="Cost snapshot">
        <p className="text-sm">Budget <Money value={facts.budget} /></p>
        <p className="text-sm">Approved cost <Money value={facts.actual} /></p>
        <p className="text-sm">Open purchase orders <Money value={facts.committed} /></p>
        <p className="text-sm">Variance (actual − budget) <Money value={facts.variance} /></p>
        <label className="mt-3 block text-sm">Project status
          <Select className="mt-1" value={project.status} onChange={(event) => void updateProjectStatus(projectId, event.target.value as ProjectStatus, actorId()).then(() => toast.success("Status updated"))}>
            {["planning", "active", "on_hold", "handover", "completed"].map((item) => <option key={item} value={item}>{labelize(item)}</option>)}
          </Select>
        </label>
      </Panel>
      <Panel title="Open issues">{issues.length === 0 ? <p className="text-sm text-muted-foreground">No open issues.</p> : issues.map((issue) => <p key={issue.id} className="text-sm">{issue.title} · {issue.location}</p>)}</Panel>
      <Panel title="Recent reports">{reports.map((report) => <p key={report.id} className="text-sm">{formatDate(report.date)} · {report.workCompleted}</p>)}</Panel>
      <Panel title="Variations">{db.variations.filter((item) => item.projectId === projectId).map((item) => <p key={item.id} className="text-sm">{item.title} · <Money value={item.valueDelta} /> · {labelize(item.status)}</p>)}</Panel>
      <p className="text-sm text-muted-foreground lg:col-span-2">{project.description}</p>
    </div>
  );
}

export function ScheduleScreen({ projectId }: { projectId?: string }) {
  const query = useDatabase();
  if (query.isLoading) return <PageSkeleton />;
  if (!query.data) return <ErrorState message="Schedule could not be loaded." onRetry={() => void query.refetch()} />;
  const rows = query.data.milestones.filter((item) => !projectId || item.projectId === projectId);
  return (
    <div>
      {projectId ? null : <PageHeader title="Schedule and milestones" description="Late means the planned end has passed and the milestone is not complete. This is not a scheduling engine." />}
      {rows.length === 0 ? <EmptyState title="No milestones" body="New projects start with a short checklist of milestones." /> : (
        <ul className="space-y-2">
          {rows.map((milestone) => {
            const shown = displayMilestoneStatus(milestone);
            return (
              <li key={milestone.id} className="rounded-2xl border border-border bg-card p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-semibold">{milestone.title}</p>
                    <p className="text-sm text-muted-foreground">{query.data?.projects.find((project) => project.id === milestone.projectId)?.code} · {formatDate(milestone.plannedStart)} – {formatDate(milestone.plannedEnd)} · {projectProgress([milestone])}%</p>
                  </div>
                  <StatusPill status={shown} />
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted"><div className="h-full bg-primary" style={{ width: `${milestone.progress}%` }} /></div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Select aria-label={`Status for ${milestone.title}`} value={milestone.status} onChange={(event) => void updateMilestone(milestone.id, { status: event.target.value as typeof milestone.status }, actorId()).then(() => toast.success("Milestone updated"))}>
                    {["upcoming", "in_progress", "blocked", "completed"].map((item) => <option key={item} value={item}>{labelize(item)}</option>)}
                  </Select>
                  <Input aria-label="Progress" type="number" className="w-24" defaultValue={milestone.progress} onBlur={(event) => void updateMilestone(milestone.id, { progress: Number(event.target.value) }, actorId())} />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export function HandoverScreen({ projectId }: { projectId?: string }) {
  const query = useDatabase();
  if (query.isLoading) return <PageSkeleton />;
  if (!query.data) return <ErrorState message="Handover could not be loaded." onRetry={() => void query.refetch()} />;
  const projects = projectId ? query.data.projects.filter((project) => project.id === projectId) : query.data.projects.filter((project) => query.data!.handover.some((item) => item.projectId === project.id));
  return (
    <div className="space-y-4">
      {projectId ? null : <PageHeader title="Handover" description="Required items must be done before a project can be marked complete. Client sign-off is a mock state." />}
      {projects.map((project) => {
        const items = query.data!.handover.filter((item) => item.projectId === project.id);
        const blocked = items.some((item) => item.required && !item.done);
        return (
          <Panel key={project.id} title={project.name} action={blocked ? <StatusPill status="at_risk" label="Blocked" /> : <StatusPill status="completed" label="Ready" />}>
            {blocked ? <p className="mb-3 text-sm text-muted-foreground">Completion stays blocked while a required item is open.</p> : <p className="mb-3 text-sm">Required items are complete. Sign-off is still only a demo state.</p>}
            <ul className="space-y-2">
              {items.map((item) => (
                <li key={item.id} className="flex items-start justify-between gap-3 text-sm">
                  <span><span className="font-medium">{item.label}</span>{item.required ? " · required" : ""}<span className="block text-muted-foreground">{item.note}</span></span>
                  <Button variant={item.done ? "secondary" : "outline"} onClick={() => void setHandoverItem(item.id, !item.done, actorId()).then(() => toast.success(item.done ? "Reopened" : "Marked done"))}>{item.done ? "Done" : "Mark done"}</Button>
                </li>
              ))}
            </ul>
            <Button className="mt-4" disabled={blocked} onClick={() => void updateProjectStatus(project.id, "completed", actorId()).then(() => toast.success("Project marked complete")).catch((error: Error) => toast.error(error.message))}>Mark project complete</Button>
          </Panel>
        );
      })}
    </div>
  );
}

export function ProjectBudgetPanel({ projectId }: { projectId: string }) {
  const query = useDatabase();
  if (!query.data) return null;
  const rows = categoryCosts(query.data, projectId);
  return (
    <Panel title="Budget, actual, and committed">
      <p className="mb-3 text-sm text-muted-foreground">Actual means approved expenses plus approved vendor bills. Committed means the outstanding value of approved or ordered purchase orders, shown on materials. Received orders are not counted twice.</p>
      <ul className="space-y-2 text-sm">
        {rows.map((row) => (
          <li key={row.category} className="grid gap-1 border-b border-border py-2 md:grid-cols-4">
            <span className="font-medium">{labelize(row.category)}</span>
            <span>Budget <Money value={row.budget} /></span>
            <span>Actual <Money value={row.actual} /></span>
            <span>Variance <Money value={row.variance} /> {row.variance > 0 ? "over" : "under"}</span>
          </li>
        ))}
      </ul>
    </Panel>
  );
}
