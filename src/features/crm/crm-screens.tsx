"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { EmptyState, ErrorState, Money, PageHeader, Panel, StatusPill } from "@/components/data-display/bits";
import { Button } from "@/components/ui/button";
import { ConfirmDialog, Drawer } from "@/components/ui/drawer";
import { Field, Input, Select, TextArea } from "@/components/ui/fields";
import { PageSkeleton } from "@/components/ui/skeleton";
import { useDatabase } from "@/components/providers";
import { formatDate } from "@/lib/dates";
import { formatPhone, labelize } from "@/lib/format";
import { can } from "@/lib/navigation";
import { calculateEstimateTotals, calculateQuotationTotals, canConvertLead } from "@/lib/calculations";
import { clientFormSchema, leadFormSchema, projectFormSchema, type ClientFormValues, type LeadFormValues, type ProjectFormValues } from "@/lib/validation";
import { addFollowUp, convertLeadToProject, createClient, createLead, createQuotationFromEstimate, saveEstimateItems, setEstimateStatus, updateLead, updateQuotation } from "@/services/actions";
import { quotationView } from "@/services/summaries";
import { demoPersonByRole } from "@/lib/navigation";
import { useUiStore } from "@/stores/ui-store";
import type { BOQItem, LeadStage } from "@/types/crm";
import type { QuotationStatus } from "@/types/crm";

function useActor() {
  const role = useUiStore((state) => state.role);
  return { role, actorId: demoPersonByRole[role], allowed: can(role, "crm.manage") };
}

export function LeadsScreen() {
  const query = useDatabase();
  const params = useSearchParams();
  const actor = useActor();
  const [open, setOpen] = useState(params.get("new") === "1");
  const [q, setQ] = useState("");
  const [stage, setStage] = useState("all");
  const [view, setView] = useState<"list" | "board">("board");
  if (query.isLoading) return <PageSkeleton />;
  if (query.isError || !query.data) return <ErrorState message="Leads could not be loaded." onRetry={() => void query.refetch()} />;
  const db = query.data;
  const leads = db.leads.filter((lead) => (stage === "all" || lead.stage === stage) && `${lead.title} ${lead.contactName} ${lead.organization}`.toLowerCase().includes(q.toLowerCase()));
  const stages = db.settings.leadStages;
  return (
    <div>
      <PageHeader eyebrow="Business" title="Leads and CRM" description="Enquiries moving toward a quotation. Stages can be renamed in settings." actions={actor.allowed ? <Button onClick={() => setOpen(true)}>Add lead</Button> : null} />
      <div className="mb-4 flex flex-wrap gap-2">
        <Input aria-label="Search leads" placeholder="Search leads" value={q} onChange={(event) => setQ(event.target.value)} className="max-w-xs" />
        <Select aria-label="Stage" value={stage} onChange={(event) => setStage(event.target.value)} className="w-auto">
          <option value="all">All stages</option>
          {stages.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
        </Select>
        <Button variant={view === "board" ? "primary" : "outline"} onClick={() => setView("board")}>Board</Button>
        <Button variant={view === "list" ? "primary" : "outline"} onClick={() => setView("list")}>List</Button>
      </div>
      {leads.length === 0 ? <EmptyState title="Lead not found" body="Clear the search or add an enquiry." /> : view === "list" ? (
        <ul className="divide-y divide-border rounded-2xl border border-border bg-card">
          {leads.map((lead) => (
            <li key={lead.id}><Link className="flex flex-col gap-1 px-4 py-3 md:flex-row md:items-center md:justify-between" href={`/crm/leads/${lead.id}`}><span className="font-semibold">{lead.title}</span><span className="text-sm text-muted-foreground">{lead.contactName} · {formatDate(lead.nextFollowUp)}</span><StatusPill status={lead.stage} /></Link></li>
          ))}
        </ul>
      ) : (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {stages.map((column) => (
            <section key={column.id} className="w-72 shrink-0 rounded-2xl bg-muted/60 p-2">
              <h2 className="px-2 py-2 text-sm font-semibold">{column.label}</h2>
              <ul className="space-y-2">
                {leads.filter((lead) => lead.stage === column.id).map((lead) => (
                  <li key={lead.id}><Link href={`/crm/leads/${lead.id}`} className="block rounded-xl bg-card p-3 shadow-sm"><span className="block font-medium">{lead.title}</span><span className="text-sm text-muted-foreground">{lead.contactName}</span><span className="mt-2 block text-sm"><Money value={lead.estimatedValue} /></span></Link></li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
      <LeadForm open={open} onOpenChange={setOpen} actorId={actor.actorId} />
    </div>
  );
}

function LeadForm({ open, onOpenChange, actorId }: { open: boolean; onOpenChange: (open: boolean) => void; actorId: string }) {
  const query = useDatabase();
  const form = useForm<LeadFormValues>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: { title: "", contactName: "", organization: "", phone: "", email: "", source: "referral", projectType: "villa", area: "", city: "Bengaluru", estimatedValue: 5000000, stage: "new", ownerId: "user_divya", nextFollowUp: "2026-10-20", notes: "" },
  });
  return (
    <Drawer open={open} onOpenChange={onOpenChange} title="Add lead" description="Saved in this browser demo only.">
      <form className="space-y-3" onSubmit={form.handleSubmit(async (values) => {
        try {
          await createLead(values, actorId);
          toast.success("Lead saved");
          onOpenChange(false);
          form.reset();
        } catch (error) {
          toast.error(error instanceof Error ? error.message : "Could not save");
        }
      })}>
        <Field label="Title" error={form.formState.errors.title?.message}><Input {...form.register("title")} /></Field>
        <Field label="Contact" error={form.formState.errors.contactName?.message}><Input {...form.register("contactName")} /></Field>
        <Field label="Organisation"><Input {...form.register("organization")} /></Field>
        <Field label="Phone" error={form.formState.errors.phone?.message}><Input {...form.register("phone")} inputMode="tel" /></Field>
        <Field label="Email" error={form.formState.errors.email?.message}><Input {...form.register("email")} /></Field>
        <Field label="Source"><Select {...form.register("source")}>{["referral", "website", "architect", "repeat", "walk_in", "broker"].map((item) => <option key={item} value={item}>{labelize(item)}</option>)}</Select></Field>
        <Field label="Project type"><Select {...form.register("projectType")}>{["villa", "apartment", "independent_house", "office_fitout", "commercial", "industrial"].map((item) => <option key={item} value={item}>{labelize(item)}</option>)}</Select></Field>
        <Field label="Area" error={form.formState.errors.area?.message}><Input {...form.register("area")} /></Field>
        <Field label="City" error={form.formState.errors.city?.message}><Input {...form.register("city")} /></Field>
        <Field label="Estimated value" error={form.formState.errors.estimatedValue?.message}><Input type="number" {...form.register("estimatedValue")} /></Field>
        <Field label="Stage"><Select {...form.register("stage")}>{(query.data?.settings.leadStages ?? []).map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</Select></Field>
        <Field label="Owner"><Select {...form.register("ownerId")}>{(query.data?.users ?? []).map((user) => <option key={user.id} value={user.id}>{user.name}</option>)}</Select></Field>
        <Field label="Next follow-up"><Input type="date" {...form.register("nextFollowUp")} /></Field>
        <Field label="Notes"><TextArea {...form.register("notes")} /></Field>
        <div className="flex gap-2"><Button type="submit" disabled={form.formState.isSubmitting}>Save</Button><Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button></div>
      </form>
    </Drawer>
  );
}

export function LeadDetail({ leadId }: { leadId: string }) {
  const query = useDatabase();
  const router = useRouter();
  const actor = useActor();
  const [note, setNote] = useState("Called to confirm the next visit.");
  const [when, setWhen] = useState("2026-10-18");
  const [convertOpen, setConvertOpen] = useState(false);
  if (query.isLoading) return <PageSkeleton />;
  const db = query.data;
  const lead = db?.leads.find((item) => item.id === leadId);
  if (!db || !lead) return <EmptyState title="Lead not found" body="It may have been reset with the demo data." action={<Link href="/crm/leads">Back to leads</Link>} />;
  const decision = canConvertLead({ stage: lead.stage, convertedProjectId: lead.convertedProjectId, existingProjectForLead: db.projects.some((project) => project.sourceLeadId === lead.id) });
  return (
    <div>
      <PageHeader eyebrow={labelize(lead.stage)} title={lead.title} description={`${lead.contactName} · ${formatPhone(lead.phone)} · ${lead.email}`} crumbs={[{ href: "/crm/leads", label: "Leads" }]} actions={<StatusPill status={lead.stage} />} />
      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Panel title="Overview">
          <p>estimated <Money value={lead.estimatedValue} /> · {labelize(lead.projectType)} · {lead.location.area}, {lead.location.city}</p>
          <p className="mt-2 text-sm text-muted-foreground">{lead.notes}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Select aria-label="Move stage" value={lead.stage} onChange={(event) => void updateLead(lead.id, { stage: event.target.value as LeadStage }, actor.actorId).then(() => toast.success("Stage updated")).catch((error: Error) => toast.error(error.message))}>
              {db.settings.leadStages.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
            </Select>
            <Button disabled={!decision.ok} onClick={() => setConvertOpen(true)}>Convert to project</Button>
          </div>
          {!decision.ok ? <p className="mt-2 text-sm text-muted-foreground">{decision.reason}</p> : null}
          {lead.convertedProjectId ? <Link className="mt-3 inline-block text-sm font-semibold" href={`/projects/${lead.convertedProjectId}`}>Open the project</Link> : null}
        </Panel>
        <Panel title="Log a follow-up">
          <Field label="Date"><Input type="date" value={when} onChange={(event) => setWhen(event.target.value)} /></Field>
          <Field label="Notes"><TextArea value={note} onChange={(event) => setNote(event.target.value)} /></Field>
          <Button className="mt-3" onClick={() => void addFollowUp(lead.id, { date: when, type: "call", notes: note, completed: false }, actor.actorId).then(() => toast.success("Follow-up saved")).catch((error: Error) => toast.error(error.message))}>Save follow-up</Button>
        </Panel>
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Panel title="Follow-ups">
          <ul className="space-y-2 text-sm">{db.followUps.filter((item) => item.leadId === lead.id).map((item) => <li key={item.id}>{formatDate(item.date)} · {labelize(item.type)} · {item.notes}</li>)}</ul>
        </Panel>
        <Panel title="Estimates">
          <ul className="space-y-2 text-sm">{db.estimates.filter((item) => item.leadId === lead.id).map((item) => <li key={item.id}><Link href={`/crm/estimates/${item.id}`}>{item.code}</Link></li>)}{db.estimates.every((item) => item.leadId !== lead.id) ? <li>No estimate yet.</li> : null}</ul>
        </Panel>
      </div>
      <ConvertDialog open={convertOpen} onOpenChange={setConvertOpen} leadId={lead.id} actorId={actor.actorId} onDone={(id) => router.push(`/projects/${id}`)} />
    </div>
  );
}

function ConvertDialog({ open, onOpenChange, leadId, actorId, onDone }: { open: boolean; onOpenChange: (open: boolean) => void; leadId: string; actorId: string; onDone: (id: string) => void }) {
  const query = useDatabase();
  const lead = query.data?.leads.find((item) => item.id === leadId);
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    values: {
      name: lead?.title ?? "",
      code: "ARH-NEW-01",
      clientId: lead?.clientId ?? query.data?.clients[0]?.id ?? "",
      type: lead?.projectType ?? "villa",
      area: lead?.location.area ?? "",
      city: lead?.location.city ?? "Bengaluru",
      managerId: "user_kavya",
      siteEngineerId: "user_arjun",
      startDate: "2026-11-01",
      plannedEndDate: "2027-06-30",
      contractValue: lead?.estimatedValue ?? 1000000,
      budget: Math.round((lead?.estimatedValue ?? 1000000) * 0.82),
      description: lead?.notes || "Converted from a lead in the demo.",
    },
  });
  return (
    <Drawer open={open} onOpenChange={onOpenChange} title="Convert to project" description="The lead stays linked. A second conversion is blocked.">
      <form className="space-y-3" onSubmit={form.handleSubmit(async (values) => {
        try {
          const id = await convertLeadToProject(leadId, values, actorId);
          toast.success("Project created from the lead");
          onDone(id);
        } catch (error) {
          toast.error(error instanceof Error ? error.message : "Could not convert");
        }
      })}>
        <Field label="Project name" error={form.formState.errors.name?.message}><Input {...form.register("name")} /></Field>
        <Field label="Code" error={form.formState.errors.code?.message}><Input {...form.register("code")} /></Field>
        <Field label="Client" error={form.formState.errors.clientId?.message}><Select {...form.register("clientId")}>{(query.data?.clients ?? []).map((client) => <option key={client.id} value={client.id}>{client.name}</option>)}</Select></Field>
        <Field label="Manager"><Select {...form.register("managerId")}>{(query.data?.users ?? []).filter((user) => user.role === "project_manager").map((user) => <option key={user.id} value={user.id}>{user.name}</option>)}</Select></Field>
        <Field label="Site engineer"><Select {...form.register("siteEngineerId")}>{(query.data?.users ?? []).filter((user) => user.role === "site_engineer").map((user) => <option key={user.id} value={user.id}>{user.name}</option>)}</Select></Field>
        <Field label="Start"><Input type="date" {...form.register("startDate")} /></Field>
        <Field label="Planned completion" error={form.formState.errors.plannedEndDate?.message}><Input type="date" {...form.register("plannedEndDate")} /></Field>
        <Field label="Contract value"><Input type="number" {...form.register("contractValue")} /></Field>
        <Field label="Budget"><Input type="number" {...form.register("budget")} /></Field>
        <Field label="Description" error={form.formState.errors.description?.message}><TextArea {...form.register("description")} /></Field>
        <Button type="submit" disabled={form.formState.isSubmitting}>Create project</Button>
      </form>
    </Drawer>
  );
}

export function ClientsScreen() {
  const query = useDatabase();
  const actor = useActor();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [kind, setKind] = useState("all");
  if (query.isLoading) return <PageSkeleton />;
  if (!query.data) return <ErrorState message="Clients could not be loaded." onRetry={() => void query.refetch()} />;
  const clients = query.data.clients.filter((client) => (kind === "all" || client.kind === kind) && client.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <div>
      <PageHeader title="Clients" description="Individuals and organisations Aarohan is talking to or building for." actions={actor.allowed ? <Button onClick={() => setOpen(true)}>Add client</Button> : null} />
      <div className="mb-4 flex gap-2"><Input aria-label="Search clients" value={q} onChange={(event) => setQ(event.target.value)} placeholder="Search" className="max-w-xs" /><Select aria-label="Kind" value={kind} onChange={(event) => setKind(event.target.value)} className="w-auto"><option value="all">All</option><option value="individual">Individual</option><option value="organization">Organisation</option></Select></div>
      {clients.length === 0 ? <EmptyState title="No clients" body="Try another filter." /> : (
        <ul className="grid gap-3 md:grid-cols-2">
          {clients.map((client) => {
            const projects = query.data?.projects.filter((project) => project.clientId === client.id).length ?? 0;
            return <li key={client.id}><Link href={`/crm/clients/${client.id}`} className="block rounded-2xl border border-border bg-card p-4"><span className="font-semibold">{client.name}</span><span className="mt-1 block text-sm text-muted-foreground">{labelize(client.kind)} · {client.location.area} · {projects} projects</span><span className="mt-2 inline-block"><StatusPill status={client.status} /></span></Link></li>;
          })}
        </ul>
      )}
      <ClientForm open={open} onOpenChange={setOpen} actorId={actor.actorId} />
    </div>
  );
}

function ClientForm({ open, onOpenChange, actorId }: { open: boolean; onOpenChange: (open: boolean) => void; actorId: string }) {
  const form = useForm<ClientFormValues>({ resolver: zodResolver(clientFormSchema), defaultValues: { name: "", kind: "individual", type: "residential", phone: "", email: "", area: "", city: "Bengaluru", contactName: "", notes: "" } });
  return (
    <Drawer open={open} onOpenChange={onOpenChange} title="Add client">
      <form className="space-y-3" onSubmit={form.handleSubmit(async (values) => {
        try {
          await createClient(values, actorId);
          toast.success("Client saved");
          onOpenChange(false);
        } catch (error) {
          toast.error(error instanceof Error ? error.message : "Could not save");
        }
      })}>
        <Field label="Name" error={form.formState.errors.name?.message}><Input {...form.register("name")} /></Field>
        <Field label="Kind"><Select {...form.register("kind")}><option value="individual">Individual</option><option value="organization">Organisation</option></Select></Field>
        <Field label="Work"><Select {...form.register("type")}><option value="residential">Residential</option><option value="commercial">Commercial</option></Select></Field>
        <Field label="Phone" error={form.formState.errors.phone?.message}><Input {...form.register("phone")} /></Field>
        <Field label="Email" error={form.formState.errors.email?.message}><Input {...form.register("email")} /></Field>
        <Field label="Area" error={form.formState.errors.area?.message}><Input {...form.register("area")} /></Field>
        <Field label="City"><Input {...form.register("city")} /></Field>
        <Field label="Primary contact" error={form.formState.errors.contactName?.message}><Input {...form.register("contactName")} /></Field>
        <Button type="submit" disabled={form.formState.isSubmitting}>Save</Button>
      </form>
    </Drawer>
  );
}

export function ClientDetail({ clientId }: { clientId: string }) {
  const query = useDatabase();
  if (query.isLoading) return <PageSkeleton />;
  const db = query.data;
  const client = db?.clients.find((item) => item.id === clientId);
  if (!db || !client) return <EmptyState title="Client not found" body="Return to the directory." action={<Link href="/crm/clients">Clients</Link>} />;
  const projects = db.projects.filter((project) => project.clientId === client.id);
  const invoices = db.invoices.filter((invoice) => invoice.clientId === client.id);
  return (
    <div>
      <PageHeader title={client.name} eyebrow={labelize(client.kind)} description={`${client.location.area}, ${client.location.city} · ${formatPhone(client.phone)}`} crumbs={[{ href: "/crm/clients", label: "Clients" }]} />
      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="People">{client.contacts.map((contact) => <p key={contact.id} className="text-sm">{contact.name} · {contact.role} · {formatPhone(contact.phone)}</p>)}</Panel>
        <Panel title="Projects">{projects.length === 0 ? <p className="text-sm text-muted-foreground">No project yet.</p> : projects.map((project) => <Link key={project.id} className="block py-1 text-sm font-medium" href={`/projects/${project.id}`}>{project.name}</Link>)}</Panel>
        <Panel title="Invoices">{invoices.map((invoice) => <Link key={invoice.id} className="block py-1 text-sm" href={`/finance/invoices/${invoice.id}`}>{invoice.number}</Link>)}</Panel>
        <Panel title="Notes"><p className="text-sm">{client.notes}</p></Panel>
      </div>
    </div>
  );
}

export function EstimatesScreen() {
  const query = useDatabase();
  const [status, setStatus] = useState("all");
  if (query.isLoading) return <PageSkeleton />;
  if (!query.data) return <ErrorState message="Estimates could not be loaded." onRetry={() => void query.refetch()} />;
  const rows = query.data.estimates.filter((estimate) => status === "all" || estimate.status === status);
  return (
    <div>
      <PageHeader title="Estimates and BOQs" description="Totals are calculated from quantities and rates. This is not a drawing takeoff." />
      <Select aria-label="Status" value={status} onChange={(event) => setStatus(event.target.value)} className="mb-4 w-auto"><option value="all">All</option><option value="draft">Draft</option><option value="under_review">Under review</option><option value="approved">Approved</option><option value="archived">Archived</option></Select>
      <ul className="divide-y divide-border rounded-2xl border border-border bg-card">
        {rows.map((estimate) => {
          const totals = calculateEstimateTotals(estimate.items, estimate.contingencyPercent);
          return <li key={estimate.id}><Link className="flex flex-col gap-1 px-4 py-3 md:flex-row md:items-center md:justify-between" href={`/crm/estimates/${estimate.id}`}><span className="font-semibold">{estimate.title}</span><span className="text-sm">{estimate.code}</span><Money value={totals.total} /><StatusPill status={estimate.status} /></Link></li>;
        })}
      </ul>
    </div>
  );
}

export function EstimateDetail({ estimateId }: { estimateId: string }) {
  const query = useDatabase();
  const actor = useActor();
  const estimate = query.data?.estimates.find((item) => item.id === estimateId);
  const [items, setItems] = useState<BOQItem[] | null>(null);
  const [contingency, setContingency] = useState<number | null>(null);
  if (query.isLoading) return <PageSkeleton />;
  if (!estimate) return <EmptyState title="Estimate not found" body="It is not in the current demo data." action={<Link href="/crm/estimates">Back</Link>} />;
  const current = items ?? estimate.items;
  const percent = contingency ?? estimate.contingencyPercent;
  const totals = calculateEstimateTotals(current, percent);
  return (
    <div>
      <PageHeader title={estimate.title} eyebrow={estimate.code} description="Line totals, tax, and contingency are calculated here. Tax is a configurable field, not advice." crumbs={[{ href: "/crm/estimates", label: "Estimates" }]} actions={<Button onClick={() => void createQuotationFromEstimate(estimate.id, actor.actorId).then((id) => { toast.success("Quotation drafted"); window.location.href = `/crm/quotations/${id}`; }).catch((error: Error) => toast.error(error.message))}>Create quotation</Button>} />
      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="text-left text-muted-foreground"><tr><th className="p-3">Description</th><th>Unit</th><th>Qty</th><th>Rate</th><th>Tax %</th><th>Amount</th></tr></thead>
          <tbody>
            {current.map((item, index) => (
              <tr key={item.id} className="border-t border-border">
                <td className="p-2"><Input value={item.description} onChange={(event) => setItems(current.map((row, rowIndex) => rowIndex === index ? { ...row, description: event.target.value } : row))} /></td>
                <td className="p-2"><Input value={item.unit} onChange={(event) => setItems(current.map((row, rowIndex) => rowIndex === index ? { ...row, unit: event.target.value } : row))} /></td>
                <td className="p-2"><Input type="number" value={item.quantity} onChange={(event) => setItems(current.map((row, rowIndex) => rowIndex === index ? { ...row, quantity: Number(event.target.value) } : row))} /></td>
                <td className="p-2"><Input type="number" value={item.unitRate} onChange={(event) => setItems(current.map((row, rowIndex) => rowIndex === index ? { ...row, unitRate: Number(event.target.value) } : row))} /></td>
                <td className="p-2"><Input type="number" value={item.taxRate} onChange={(event) => setItems(current.map((row, rowIndex) => rowIndex === index ? { ...row, taxRate: Number(event.target.value) } : row))} /></td>
                <td className="p-2"><Money value={item.quantity * item.unitRate} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex flex-wrap items-end gap-3">
        <Field label="Contingency %"><Input type="number" value={percent} onChange={(event) => setContingency(Number(event.target.value))} className="w-28" /></Field>
        <Button variant="outline" onClick={() => setItems([...current, { id: `new_${current.length}`, description: "New line", category: "materials", unit: "nos", quantity: 1, unitRate: 0, taxRate: 18 }])}>Add row</Button>
        <Button onClick={() => void saveEstimateItems(estimate.id, current, percent, actor.actorId, "Edited in the BOQ").then(() => toast.success("Revision saved")).catch((error: Error) => toast.error(error.message))}>Save revision</Button>
        <Button variant="secondary" onClick={() => void setEstimateStatus(estimate.id, "approved", actor.actorId).then(() => toast.success("Marked approved in the demo")).catch((error: Error) => toast.error(error.message))}>Mark approved</Button>
      </div>
      <p className="mt-4 text-sm">Subtotal <Money value={totals.subtotal} /> · Tax <Money value={totals.tax} /> · Contingency <Money value={totals.contingency} /> · Total <Money value={totals.total} /></p>
      <Panel title="Versions">
        <ul className="space-y-2 text-sm">{estimate.versions.map((version) => <li key={version.version}>v{version.version} · {formatDate(version.at)} · {query.data?.users.find((user) => user.id === version.byId)?.name} · {version.note}</li>)}</ul>
      </Panel>
    </div>
  );
}

export function QuotationsScreen() {
  const query = useDatabase();
  const [status, setStatus] = useState("all");
  if (query.isLoading) return <PageSkeleton />;
  if (!query.data) return <ErrorState message="Quotations could not be loaded." onRetry={() => void query.refetch()} />;
  const rows = query.data.quotations.filter((item) => status === "all" || item.status === status);
  return (
    <div>
      <PageHeader title="Quotations" description="Sending a quotation only changes its demo status. SiteFlow does not email anyone." />
      <Select aria-label="Status" className="mb-4 w-auto" value={status} onChange={(event) => setStatus(event.target.value)}><option value="all">All</option>{["draft", "in_review", "approved", "sent", "accepted", "declined", "expired"].map((item) => <option key={item} value={item}>{labelize(item)}</option>)}</Select>
      {rows.length === 0 ? <EmptyState title="No quotations" body="Create one from an estimate." /> : (
        <ul className="divide-y divide-border rounded-2xl border border-border bg-card">
          {rows.map((quotation) => {
            const view = quotationView(query.data!, quotation.id);
            return <li key={quotation.id}><Link className="grid gap-1 px-4 py-3 md:grid-cols-4 md:items-center" href={`/crm/quotations/${quotation.id}`}><span className="font-semibold">{quotation.code}</span><span className="text-sm">{quotation.title}</span>{view?.totals ? <Money value={view.totals.grandTotal} /> : <span />}<StatusPill status={quotation.status} /></Link></li>;
          })}
        </ul>
      )}
    </div>
  );
}

const nextStatus: Partial<Record<QuotationStatus, QuotationStatus>> = { draft: "in_review", in_review: "approved", approved: "sent", sent: "accepted" };

export function QuotationDetail({ quotationId }: { quotationId: string }) {
  const query = useDatabase();
  const actor = useActor();
  const [confirmSend, setConfirmSend] = useState(false);
  const view = query.data ? quotationView(query.data, quotationId) : undefined;
  if (query.isLoading) return <PageSkeleton />;
  if (!view?.quotation || !view.totals || !view.estimate) return <EmptyState title="Quotation not found" body="The linked estimate may be missing." action={<Link href="/crm/quotations">Back</Link>} />;
  const { quotation, totals, estimate } = view;
  const upcoming = nextStatus[quotation.status];
  return (
    <div>
      <PageHeader title={quotation.title} eyebrow={quotation.code} description={`Valid until ${formatDate(quotation.validityDate)} ${quotation.notes}`} crumbs={[{ href: "/crm/quotations", label: "Quotations" }]} />
      <article className="rounded-2xl border border-border bg-card p-6 print:border-0">
        <h2 className="text-xl font-semibold">Aarohan Buildworks</h2>
        <p className="text-sm text-muted-foreground">Preview only. Not a transmitted quotation.</p>
        <p className="mt-4">Estimate {estimate.code}</p>
        <p className="mt-2 text-sm">BOQ total <Money value={totals.total} /></p>
        <p className="text-sm">Discount <Money value={totals.discount} /></p>
        <p className="text-sm">{quotation.adjustmentLabel || "Adjustment"} <Money value={totals.adjustment} /></p>
        <p className="mt-2 text-lg font-semibold">Quotation total <Money value={totals.grandTotal} /></p>
      </article>
      <div className="no-print mt-4 flex flex-wrap gap-2">
        <Field label="Discount"><Input type="number" defaultValue={quotation.discountAmount} id="discount" /></Field>
        <Button variant="outline" onClick={() => {
          const input = document.getElementById("discount") as HTMLInputElement | null;
          void updateQuotation(quotation.id, { discountAmount: Number(input?.value ?? 0) }, actor.actorId).then(() => toast.success("Discount updated")).catch((error: Error) => toast.error(error.message));
        }}>Save discount</Button>
        {upcoming && upcoming !== "sent" ? <Button onClick={() => void updateQuotation(quotation.id, { status: upcoming }, actor.actorId).then(() => toast.success("Status updated")).catch((error: Error) => toast.error(error.message))}>Mark {labelize(upcoming)}</Button> : null}
        {quotation.status === "approved" ? <Button onClick={() => setConfirmSend(true)}>Mark sent (simulated)</Button> : null}
        {quotation.status === "sent" ? <Button variant="outline" onClick={() => void updateQuotation(quotation.id, { status: "declined" }, actor.actorId).then(() => toast.success("Marked declined")).catch((error: Error) => toast.error(error.message))}>Mark declined</Button> : null}
        <Button variant="secondary" onClick={() => window.print()}>Print preview</Button>
      </div>
      <ConfirmDialog open={confirmSend} onOpenChange={setConfirmSend} title="Mark this quotation sent?" body="This only changes the demo status. No email, WhatsApp message, or PDF is delivered." confirmLabel="Mark sent" onConfirm={() => void updateQuotation(quotation.id, { status: "sent" }, actor.actorId).then(() => toast.success("Marked sent in the demo")).catch((error: Error) => toast.error(error.message))} />
    </div>
  );
}

export function useLeadCount() {
  return useMemo(() => 0, []);
}
