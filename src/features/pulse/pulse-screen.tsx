"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { EmptyState, ErrorState, Metric, Money, PageHeader, Panel, StatusPill } from "@/components/data-display/bits";
import { PageSkeleton } from "@/components/ui/skeleton";
import { Select } from "@/components/ui/fields";
import { useDatabase } from "@/components/providers";
import { formatPercent } from "@/lib/format";
import { greetingForHour } from "@/lib/dates";
import { demoPersonByRole } from "@/lib/navigation";
import { attentionItems, demoInsights, projectFacts } from "@/services/summaries";
import { useUiStore } from "@/stores/ui-store";
import type { ProjectStatus, ProjectType } from "@/types/project";

export function PulseScreen() {
  const query = useDatabase();
  const role = useUiStore((state) => state.role);
  const [type, setType] = useState<ProjectType | "all">("all");
  const [managerId, setManagerId] = useState(role === "project_manager" ? demoPersonByRole.project_manager : "all");
  const [status, setStatus] = useState<ProjectStatus | "all">("all");
  const [windowFrom, setWindowFrom] = useState("2026-09-01");

  const view = useMemo(() => {
    const db = query.data;
    if (!db) return undefined;
    const person = demoPersonByRole[role];
    let projects = db.projects.filter((project) => {
      if (type !== "all" && project.type !== type) return false;
      if (managerId !== "all" && project.managerId !== managerId) return false;
      if (status !== "all" && project.status !== status) return false;
      if (role === "site_engineer" && project.siteEngineerId !== person && managerId === "all") return project.siteEngineerId === person;
      return true;
    });
    if (role === "site_engineer") {
      projects = db.projects.filter((project) => project.siteEngineerId === person && (type === "all" || project.type === type) && (status === "all" || project.status === status));
    }
    const facts = projects.map((project) => projectFacts(db, project));
    const ids = new Set(projects.map((project) => project.id));
    const attention = attentionItems(db, ids).slice(0, 6);
    const activity = db.activities.filter((item) => (!item.projectId || ids.has(item.projectId)) && item.createdAt.slice(0, 10) >= windowFrom).slice(0, 6);
    const active = facts.filter((item) => item.project.status === "active" || item.project.status === "handover").length;
    const risk = facts.filter((item) => item.health === "at_risk" || item.health === "delayed").length;
    const overdue = facts.reduce((sum, item) => sum + item.overdueTasks, 0);
    const receivables = facts.reduce((sum, item) => sum + item.receivables, 0);
    const variance = facts.reduce((sum, item) => sum + item.variance, 0);
    const chart = facts.map((item) => ({ name: item.project.code.replace("ARH-", ""), Budget: item.budget, Actual: item.actual, Committed: item.committed }));
    return { facts, attention, activity, active, risk, overdue, receivables, variance, chart, db };
  }, [query.data, type, managerId, status, role, windowFrom]);

  if (query.isLoading) return <PageSkeleton />;
  if (query.isError || !view) return <ErrorState message={query.error instanceof Error ? query.error.message : "Pulse could not be loaded"} onRetry={() => void query.refetch()} />;

  const hour = new Date().getHours();
  const company = view.db.settings.companyName;

  return (
    <div>
      <PageHeader
        eyebrow="SiteFlow Pulse"
        title={`${greetingForHour(hour)} ${role === "accountant" ? "Rohan" : role === "site_engineer" ? "Arjun" : role === "project_manager" ? "Kavya" : "Meera"}`}
        description={`${company} · What is holding, what is slipping, and what needs a decision. The numbers come from the same data as the lists.`}
        actions={<Link className="inline-flex h-11 items-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground" href={role === "site_engineer" ? "/operations/site-reports?new=1" : "/projects/new"}>Primary action</Link>}
      />
      <div className="mb-4 flex flex-wrap gap-2">
        <Select aria-label="Project type" value={type} onChange={(event) => setType(event.target.value as ProjectType | "all")} className="w-auto">
          <option value="all">All types</option>
          <option value="villa">Villa</option>
          <option value="apartment">Apartment</option>
          <option value="independent_house">Independent house</option>
          <option value="office_fitout">Office fit-out</option>
          <option value="commercial">Commercial</option>
          <option value="industrial">Industrial</option>
        </Select>
        {role !== "site_engineer" ? (
          <Select aria-label="Project manager" value={managerId} onChange={(event) => setManagerId(event.target.value)} className="w-auto">
            <option value="all">All managers</option>
            {view.db.users.filter((user) => user.jobTitle === "Project manager").map((user) => <option key={user.id} value={user.id}>{user.name}</option>)}
          </Select>
        ) : null}
        <Select aria-label="Project status" value={status} onChange={(event) => setStatus(event.target.value as ProjectStatus | "all")} className="w-auto">
          <option value="all">All statuses</option>
          <option value="planning">Planning</option>
          <option value="active">Active</option>
          <option value="on_hold">On hold</option>
          <option value="handover">Handover</option>
          <option value="completed">Completed</option>
        </Select>
        <label className="text-sm text-muted-foreground">
          Activity from
          <input type="date" value={windowFrom} onChange={(event) => setWindowFrom(event.target.value)} className="ml-2 h-11 rounded-xl border border-border bg-card px-3" />
        </label>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <Metric label="Active projects" value={view.active} hint="Active or in handover" href="/projects" />
        <Metric label="At risk or delayed" value={view.risk} hint="Labelled, not colour alone" href="/projects" />
        <Metric label="Overdue tasks" value={view.overdue} hint="Tasks still open after the demo date" href="/operations/tasks" />
        <Metric label="Receivables" value={<Money value={view.receivables} />} hint="Issued invoices still outstanding" href="/finance/invoices" />
        <Metric label="Cost variance" value={<Money value={view.variance} />} hint="Actual minus budget. A positive number means over." href="/finance/job-costing" />
      </div>
      {demoInsights(view.db, role).length > 0 ? (
        <div className="mt-4 rounded-2xl border border-border bg-card p-4 text-sm">
          <p className="font-semibold">Worth a look, from demo rules</p>
          <ul className="mt-2 space-y-1">
            {demoInsights(view.db, role).map((insight) => (
              <li key={insight.id}><Link className="underline" href={insight.href}>{insight.title}</Link> — {insight.body}</li>
            ))}
          </ul>
        </div>
      ) : null}
      <div className="mt-4 grid gap-4 xl:grid-cols-[1.4fr_0.8fr]">
        <Panel title="Project health">
          {view.facts.length === 0 ? <EmptyState title="No projects in this view" body="Widen the filters to see Aarohan's portfolio." /> : (
            <ul className="divide-y divide-border">
              {view.facts.map((item) => (
                <li key={item.project.id}>
                  <Link href={`/projects/${item.project.id}`} className="grid gap-2 py-3 md:grid-cols-[1.4fr_0.8fr_0.6fr] md:items-center">
                    <span>
                      <span className="block font-semibold">{item.project.name}</span>
                      <span className="text-sm text-muted-foreground">{item.clientName} · {item.project.location.area}</span>
                    </span>
                    <span className="text-sm">{formatPercent(item.progress)} · next {item.nextMilestoneTitle}</span>
                    <span className="flex flex-wrap gap-2"><StatusPill status={item.health} /> <StatusPill status={item.project.status} /></span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Panel>
        <Panel title="Needs attention">
          {view.attention.length === 0 ? <EmptyState title="Nothing in this queue" body="No overdue follow-ups, approvals, or budget warnings match this filter." /> : (
            <ul className="space-y-3">
              {view.attention.map((item) => (
                <li key={item.id}>
                  <Link href={item.href} className="block rounded-xl border border-border p-3 hover:bg-muted">
                    <StatusPill status={item.tone === "danger" ? "overdue" : item.tone === "warning" ? "at_risk" : "pending_approval"} label={item.label} />
                    <p className="mt-2 font-medium">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.detail}</p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Panel title="Budget, actual, and committed">
          <p className="mb-3 text-sm text-muted-foreground">Actual is approved cost. Committed is the value of open purchase orders. They are not added into one number.</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={view.chart}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="Budget" name="Budget" fill="#1e3a2f" />
                <Bar dataKey="Actual" name="Actual" fill="#8a5a00" />
                <Bar dataKey="Committed" name="Committed" fill="#d5e46a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <table className="sr-only">
            <caption>Budget, actual, and committed by project</caption>
            <tbody>
              {view.chart.map((row) => <tr key={row.name}><td>{row.name}</td><td>{row.Budget}</td><td>{row.Actual}</td><td>{row.Committed}</td></tr>)}
            </tbody>
          </table>
        </Panel>
        <Panel title="Latest activity from site and office" action={<Link href="/activity" className="text-sm font-semibold">See all</Link>}>
          {view.activity.length === 0 ? <EmptyState title="No activity in this range" body="Move the date back to see September and October activity." /> : (
            <ul className="space-y-3">
              {view.activity.map((item) => (
                <li key={item.id}>
                  <Link href={item.href} className="block">
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.detail}</p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {[
          ["/crm/leads?new=1", "Add lead"],
          ["/projects/new", "Create project"],
          ["/operations/site-reports?new=1", "Add a site report"],
          ["/finance/expenses?new=1", "Record an expense"],
          ["/operations/requests?new=1", "Request materials"],
          ["/operations/tasks?new=1", "Create a task"],
        ].map(([href, label]) => (
          <Link key={href} href={href} className="inline-flex h-11 items-center rounded-xl border border-border bg-card px-4 text-sm font-semibold">{label}</Link>
        ))}
      </div>
    </div>
  );
}
