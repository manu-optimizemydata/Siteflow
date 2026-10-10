import { canConvertLead, DEMO_TODAY } from "@/lib/calculations";
import { createId } from "@/lib/utils";
import type { ClientFormValues, DailyReportValues, ExpenseFormValues, InvoiceFormValues, LeadFormValues, MaterialRequestValues, ProjectFormValues, TaskFormValues } from "@/lib/validation";
import { companyId } from "@/mocks/helpers";
import type { Database } from "@/mocks/types";
import { gate, mutateDatabase } from "@/services/database";
import type { ActivityEvent, ActivityType } from "@/types/activity";
import type { LeadStage, QuotationStatus } from "@/types/crm";
import type { CostCategoryId } from "@/types/common";
import type { MaterialRequestStatus, PurchaseOrderStatus } from "@/types/procurement";
import type { ExpenseStatus, PaymentMethod, VendorBillLifecycle } from "@/types/finance";
import type { MilestoneStatus, ProjectStatus, TaskStatus } from "@/types/project";
import type { AttendanceStatus, ReportStatus } from "@/types/site";
import type { DocumentCategory } from "@/types/documents";

function stamp(): string {
  return new Date().toISOString();
}

function phoneDigits(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return digits.length > 10 ? digits.slice(-10) : digits;
}

function activity(
  db: Database,
  input: Omit<ActivityEvent, "id" | "companyId" | "createdAt"> & { createdAt?: string },
): void {
  db.activities.unshift({
    id: createId("act"),
    companyId,
    createdAt: input.createdAt ?? stamp(),
    type: input.type,
    title: input.title,
    detail: input.detail,
    actorId: input.actorId,
    projectId: input.projectId,
    leadId: input.leadId,
    clientId: input.clientId,
    entityType: input.entityType,
    entityId: input.entityId,
    href: input.href,
  });
}

function notify(db: Database, title: string, body: string, href: string, kind: Database["notifications"][number]["kind"]): void {
  db.notifications.unshift({
    id: createId("nt"),
    companyId,
    title,
    body,
    createdAt: stamp(),
    read: false,
    href,
    kind,
    recipientRole: "all",
  });
}

const budgetWeights: Array<[CostCategoryId, number]> = [
  ["materials", 0.46],
  ["labour", 0.18],
  ["subcontractors", 0.16],
  ["equipment", 0.08],
  ["overhead", 0.07],
  ["other", 0.05],
];

function addBudget(db: Database, projectId: string, total: number): void {
  db.budgets.push({
    id: createId("bud"),
    companyId,
    projectId,
    lines: budgetWeights.map(([category, weight]) => ({ category, amount: Math.round(total * weight) })),
  });
}

function addStarterMilestones(db: Database, projectId: string, ownerId: string, start: string, end: string): void {
  const titles = ["Site establishment", "Structure", "Masonry and plaster", "Services", "Finishes", "Handover"];
  titles.forEach((title, index) => {
    db.milestones.push({
      id: createId("ms"),
      companyId,
      projectId,
      title,
      plannedStart: start,
      plannedEnd: end,
      ownerId,
      status: index === 0 ? "in_progress" : "upcoming",
      progress: index === 0 ? 10 : 0,
      weight: 1,
      notes: "Created with the project. Dates are a starting point, not a schedule engine.",
    });
  });
}

export async function createLead(input: LeadFormValues, actorId: string): Promise<string> {
  await gate();
  const id = createId("lead");
  mutateDatabase((db) => {
    db.leads.unshift({
      id,
      companyId,
      title: input.title,
      contactName: input.contactName,
      organization: input.organization ?? "",
      phone: phoneDigits(input.phone),
      email: input.email,
      source: input.source,
      projectType: input.projectType,
      location: { line1: input.area, area: input.area, city: input.city, state: "Karnataka", postalCode: "" },
      estimatedValue: input.estimatedValue,
      stage: input.stage,
      ownerId: input.ownerId,
      nextFollowUp: input.nextFollowUp || undefined,
      notes: input.notes ?? "",
      createdAt: DEMO_TODAY,
    });
    activity(db, {
      type: "lead_created",
      title: `Lead created: ${input.title}`,
      detail: `${input.contactName} · ${input.city}`,
      actorId,
      leadId: id,
      entityType: "lead",
      entityId: id,
      href: `/crm/leads/${id}`,
    });
  });
  return id;
}

export async function updateLead(leadId: string, patch: Partial<LeadFormValues> & { stage?: LeadStage }, actorId: string): Promise<void> {
  await gate();
  mutateDatabase((db) => {
    const lead = db.leads.find((item) => item.id === leadId);
    if (!lead) throw new Error("Lead not found");
    if (patch.title) lead.title = patch.title;
    if (patch.contactName) lead.contactName = patch.contactName;
    if (patch.organization !== undefined) lead.organization = patch.organization ?? "";
    if (patch.phone) lead.phone = phoneDigits(patch.phone);
    if (patch.email) lead.email = patch.email;
    if (patch.source) lead.source = patch.source;
    if (patch.projectType) lead.projectType = patch.projectType;
    if (patch.area) lead.location = { ...lead.location, area: patch.area, line1: patch.area };
    if (patch.city) lead.location = { ...lead.location, city: patch.city };
    if (patch.estimatedValue) lead.estimatedValue = patch.estimatedValue;
    if (patch.stage) lead.stage = patch.stage;
    if (patch.ownerId) lead.ownerId = patch.ownerId;
    if (patch.nextFollowUp !== undefined) lead.nextFollowUp = patch.nextFollowUp || undefined;
    if (patch.notes !== undefined) lead.notes = patch.notes ?? "";
    lead.lastContact = DEMO_TODAY;
    activity(db, {
      type: "follow_up_logged",
      title: `Lead updated: ${lead.title}`,
      detail: `Stage is now ${lead.stage.replaceAll("_", " ")}.`,
      actorId,
      leadId,
      clientId: lead.clientId,
      entityType: "lead",
      entityId: leadId,
      href: `/crm/leads/${leadId}`,
    });
  });
}

export async function addFollowUp(leadId: string, input: { date: string; type: "call" | "meeting" | "email" | "site_visit"; notes: string; completed: boolean }, actorId: string): Promise<void> {
  await gate();
  mutateDatabase((db) => {
    const lead = db.leads.find((item) => item.id === leadId);
    if (!lead) throw new Error("Lead not found");
    const id = createId("fu");
    db.followUps.unshift({ id, companyId, leadId, date: input.date, type: input.type, notes: input.notes, ownerId: actorId, completed: input.completed });
    lead.lastContact = input.date;
    if (!input.completed) lead.nextFollowUp = input.date;
    if (input.type === "site_visit") {
      db.siteVisits.unshift({ id: createId("sv"), companyId, leadId, date: input.date, location: lead.location.area, notes: input.notes, ownerId: actorId });
    }
    activity(db, {
      type: "follow_up_logged",
      title: `Follow-up logged for ${lead.contactName}`,
      detail: input.notes,
      actorId,
      leadId,
      clientId: lead.clientId,
      entityType: "lead",
      entityId: leadId,
      href: `/crm/leads/${leadId}`,
    });
  });
}

export async function convertLeadToProject(leadId: string, input: ProjectFormValues, actorId: string): Promise<string> {
  await gate();
  const id = createId("proj");
  let error: string | undefined;
  mutateDatabase((db) => {
    const lead = db.leads.find((item) => item.id === leadId);
    if (!lead) {
      error = "Lead not found";
      return;
    }
    const decision = canConvertLead({
      stage: lead.stage,
      convertedProjectId: lead.convertedProjectId,
      existingProjectForLead: db.projects.some((project) => project.sourceLeadId === leadId),
    });
    if (!decision.ok) {
      error = decision.reason;
      return;
    }
    const quotation = db.quotations.find((item) => item.leadId === leadId && item.status === "accepted");
    db.projects.unshift({
      id,
      companyId,
      code: input.code,
      name: input.name,
      clientId: input.clientId,
      type: input.type,
      status: "planning",
      location: { line1: input.area, area: input.area, city: input.city, state: "Karnataka", postalCode: "" },
      managerId: input.managerId,
      siteEngineerId: input.siteEngineerId,
      startDate: input.startDate,
      plannedEndDate: input.plannedEndDate,
      contractValue: input.contractValue,
      sourceLeadId: leadId,
      sourceQuotationId: quotation?.id,
      description: input.description,
      image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1600&q=80",
    });
    addBudget(db, id, input.budget);
    addStarterMilestones(db, id, input.managerId, input.startDate, input.plannedEndDate);
    lead.stage = "won";
    lead.convertedProjectId = id;
    lead.clientId = input.clientId;
    if (quotation) quotation.projectId = id;
    activity(db, {
      type: "project_created",
      title: `${lead.title} became a project`,
      detail: `${input.code} keeps the lead and any accepted quotation.`,
      actorId,
      projectId: id,
      leadId,
      clientId: input.clientId,
      entityType: "project",
      entityId: id,
      href: `/projects/${id}`,
    });
    notify(db, "Project created from a lead", input.name, `/projects/${id}`, "milestone");
  });
  if (error) throw new Error(error);
  return id;
}

export async function createClient(input: ClientFormValues, actorId: string): Promise<string> {
  await gate();
  const id = createId("client");
  mutateDatabase((db) => {
    db.clients.unshift({
      id,
      companyId,
      name: input.name,
      kind: input.kind,
      type: input.type,
      status: "prospect",
      phone: phoneDigits(input.phone),
      email: input.email,
      location: { line1: input.area, area: input.area, city: input.city, state: "Karnataka", postalCode: "" },
      contacts: [{ id: createId("cp"), name: input.contactName, role: "Primary", phone: phoneDigits(input.phone), email: input.email }],
      notes: input.notes ?? "",
    });
    activity(db, {
      type: "lead_created",
      title: `Client added: ${input.name}`,
      detail: input.kind === "organization" ? "Organisation" : "Individual",
      actorId,
      clientId: id,
      entityType: "client",
      entityId: id,
      href: `/crm/clients/${id}`,
    });
  });
  return id;
}

export async function createProject(input: ProjectFormValues, actorId: string): Promise<string> {
  await gate();
  const id = createId("proj");
  mutateDatabase((db) => {
    db.projects.unshift({
      id,
      companyId,
      code: input.code,
      name: input.name,
      clientId: input.clientId,
      type: input.type,
      status: "planning",
      location: { line1: input.area, area: input.area, city: input.city, state: "Karnataka", postalCode: "" },
      managerId: input.managerId,
      siteEngineerId: input.siteEngineerId,
      startDate: input.startDate,
      plannedEndDate: input.plannedEndDate,
      contractValue: input.contractValue,
      description: input.description,
      image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1600&q=80",
    });
    addBudget(db, id, input.budget);
    addStarterMilestones(db, id, input.managerId, input.startDate, input.plannedEndDate);
    activity(db, {
      type: "project_created",
      title: `Project created: ${input.name}`,
      detail: input.code,
      actorId,
      projectId: id,
      clientId: input.clientId,
      entityType: "project",
      entityId: id,
      href: `/projects/${id}`,
    });
  });
  return id;
}

export async function updateProjectStatus(projectId: string, status: ProjectStatus, actorId: string): Promise<void> {
  await gate();
  mutateDatabase((db) => {
    const project = db.projects.find((item) => item.id === projectId);
    if (!project) throw new Error("Project not found");
    project.status = status;
    activity(db, {
      type: "milestone_updated",
      title: `${project.name} is ${status.replaceAll("_", " ")}`,
      detail: "Status updated in the demo workspace.",
      actorId,
      projectId,
      entityType: "project",
      entityId: projectId,
      href: `/projects/${projectId}`,
    });
  });
}

export async function updateMilestone(milestoneId: string, patch: { status?: MilestoneStatus; progress?: number; plannedEnd?: string; ownerId?: string }, actorId: string): Promise<void> {
  await gate();
  mutateDatabase((db) => {
    const milestone = db.milestones.find((item) => item.id === milestoneId);
    if (!milestone) throw new Error("Milestone not found");
    if (patch.status) milestone.status = patch.status;
    if (patch.progress !== undefined) milestone.progress = Math.max(0, Math.min(100, patch.progress));
    if (patch.plannedEnd) milestone.plannedEnd = patch.plannedEnd;
    if (patch.ownerId) milestone.ownerId = patch.ownerId;
    if (milestone.status === "completed") milestone.progress = 100;
    activity(db, {
      type: "milestone_updated",
      title: `Milestone updated: ${milestone.title}`,
      detail: `${milestone.progress}% · ${milestone.status.replaceAll("_", " ")}`,
      actorId,
      projectId: milestone.projectId,
      entityType: "milestone",
      entityId: milestoneId,
      href: `/projects/${milestone.projectId}/schedule`,
    });
  });
}

export async function updateBudgetLine(projectId: string, category: CostCategoryId, amount: number, actorId: string): Promise<void> {
  await gate();
  if (amount < 0) throw new Error("Budget cannot be negative");
  mutateDatabase((db) => {
    const budget = db.budgets.find((item) => item.projectId === projectId);
    if (!budget) throw new Error("Budget not found");
    const line = budget.lines.find((item) => item.category === category);
    if (!line) throw new Error("Category not found");
    line.amount = amount;
    activity(db, {
      type: "estimate_updated",
      title: "Budget line updated",
      detail: `${category} is now set in the demo budget.`,
      actorId,
      projectId,
      entityType: "budget",
      entityId: budget.id,
      href: `/projects/${projectId}/budget`,
    });
  });
}

export async function saveEstimateItems(estimateId: string, items: Database["estimates"][number]["items"], contingencyPercent: number, actorId: string, note: string): Promise<void> {
  await gate();
  mutateDatabase((db) => {
    const estimate = db.estimates.find((item) => item.id === estimateId);
    if (!estimate) throw new Error("Estimate not found");
    estimate.items = items;
    estimate.contingencyPercent = contingencyPercent;
    estimate.updatedAt = DEMO_TODAY;
    const version = (estimate.versions.at(-1)?.version ?? 0) + 1;
    estimate.versions.push({ version, at: DEMO_TODAY, byId: actorId, note: note || "Revision saved", items: structuredClone(items), contingencyPercent });
    activity(db, {
      type: "estimate_updated",
      title: `${estimate.code} revised`,
      detail: note || `Version ${version}`,
      actorId,
      projectId: estimate.projectId,
      leadId: estimate.leadId,
      clientId: estimate.clientId,
      entityType: "estimate",
      entityId: estimateId,
      href: `/crm/estimates/${estimateId}`,
    });
  });
}

export async function setEstimateStatus(estimateId: string, status: Database["estimates"][number]["status"], actorId: string): Promise<void> {
  await gate();
  mutateDatabase((db) => {
    const estimate = db.estimates.find((item) => item.id === estimateId);
    if (!estimate) throw new Error("Estimate not found");
    estimate.status = status;
    estimate.updatedAt = DEMO_TODAY;
    activity(db, {
      type: "estimate_updated",
      title: `${estimate.code} marked ${status.replaceAll("_", " ")}`,
      detail: "Mock approval only. This is not a commercial sign-off.",
      actorId,
      leadId: estimate.leadId,
      clientId: estimate.clientId,
      projectId: estimate.projectId,
      entityType: "estimate",
      entityId: estimateId,
      href: `/crm/estimates/${estimateId}`,
    });
  });
}

export async function createQuotationFromEstimate(estimateId: string, actorId: string): Promise<string> {
  await gate();
  const id = createId("quo");
  mutateDatabase((db) => {
    const estimate = db.estimates.find((item) => item.id === estimateId);
    if (!estimate?.clientId) throw new Error("Link a client before creating a quotation");
    const count = db.quotations.filter((item) => item.estimateId === estimateId).length + 1;
    db.quotations.unshift({
      id,
      companyId,
      code: `QT-${estimate.code.replace("EST-", "")}-R${count}`,
      title: `${estimate.title} quotation`,
      clientId: estimate.clientId,
      leadId: estimate.leadId,
      projectId: estimate.projectId,
      estimateId,
      version: count,
      status: "draft",
      validityDate: "2026-11-30",
      discountAmount: 0,
      adjustmentLabel: "",
      adjustmentAmount: 0,
      notes: "Draft created from the current BOQ. Nothing has been sent.",
      createdAt: DEMO_TODAY,
    });
    activity(db, {
      type: "quotation_status",
      title: "Quotation drafted from an estimate",
      detail: estimate.code,
      actorId,
      leadId: estimate.leadId,
      clientId: estimate.clientId,
      projectId: estimate.projectId,
      entityType: "quotation",
      entityId: id,
      href: `/crm/quotations/${id}`,
    });
  });
  return id;
}

export async function updateQuotation(quotationId: string, patch: { status?: QuotationStatus; discountAmount?: number; adjustmentAmount?: number; adjustmentLabel?: string }, actorId: string): Promise<void> {
  await gate();
  mutateDatabase((db) => {
    const quotation = db.quotations.find((item) => item.id === quotationId);
    if (!quotation) throw new Error("Quotation not found");
    if (patch.discountAmount !== undefined) quotation.discountAmount = patch.discountAmount;
    if (patch.adjustmentAmount !== undefined) quotation.adjustmentAmount = patch.adjustmentAmount;
    if (patch.adjustmentLabel !== undefined) quotation.adjustmentLabel = patch.adjustmentLabel;
    if (patch.status) {
      quotation.status = patch.status;
      if (patch.status === "sent") quotation.issueDate = DEMO_TODAY;
      const lead = db.leads.find((item) => item.id === quotation.leadId);
      if (lead && patch.status === "accepted") lead.stage = "won";
      if (lead && (patch.status === "sent" || patch.status === "in_review")) lead.stage = "quotation";
    }
    const simulated = quotation.status === "sent" ? " Marked sent inside this demo. No email or message was delivered." : "";
    activity(db, {
      type: "quotation_status",
      title: `${quotation.code} is ${quotation.status.replaceAll("_", " ")}`,
      detail: `Discount and adjustment stay visible on the quotation.${simulated}`,
      actorId,
      leadId: quotation.leadId,
      clientId: quotation.clientId,
      projectId: quotation.projectId,
      entityType: "quotation",
      entityId: quotationId,
      href: `/crm/quotations/${quotationId}`,
    });
  });
}

export async function createTask(input: TaskFormValues, actorId: string): Promise<string> {
  await gate();
  const id = createId("task");
  mutateDatabase((db) => {
    db.tasks.unshift({
      id,
      companyId,
      projectId: input.projectId,
      title: input.title,
      description: input.description ?? "",
      assigneeId: input.assigneeId,
      createdById: actorId,
      dueDate: input.dueDate,
      priority: input.priority,
      status: "todo",
      category: input.category,
    });
    activity(db, {
      type: "task_completed",
      title: `Task created: ${input.title}`,
      detail: "Assigned in the demo workspace.",
      actorId,
      projectId: input.projectId,
      entityType: "task",
      entityId: id,
      href: "/operations/tasks",
    });
    notify(db, "Task assigned", input.title, "/operations/tasks", "task");
  });
  return id;
}

export async function updateTask(taskId: string, patch: { status?: TaskStatus; assigneeId?: string }, actorId: string): Promise<void> {
  await gate();
  mutateDatabase((db) => {
    const task = db.tasks.find((item) => item.id === taskId);
    if (!task) throw new Error("Task not found");
    if (patch.status) task.status = patch.status;
    if (patch.assigneeId) task.assigneeId = patch.assigneeId;
    activity(db, {
      type: "task_completed",
      title: task.status === "done" ? `Task completed: ${task.title}` : `Task updated: ${task.title}`,
      detail: task.status.replaceAll("_", " "),
      actorId,
      projectId: task.projectId,
      entityType: "task",
      entityId: taskId,
      href: "/operations/tasks",
    });
  });
}

export async function createIssue(input: { projectId: string; title: string; location: string; severity: "low" | "medium" | "high"; description: string; ownerId: string; dueDate: string }, actorId: string): Promise<void> {
  await gate();
  mutateDatabase((db) => {
    const id = createId("issue");
    db.issues.unshift({
      id,
      companyId,
      projectId: input.projectId,
      title: input.title,
      location: input.location,
      severity: input.severity,
      category: "defect",
      ownerId: input.ownerId,
      dueDate: input.dueDate,
      status: "open",
      description: input.description,
    });
    activity(db, {
      type: "report_submitted",
      title: `Issue raised: ${input.title}`,
      detail: input.location,
      actorId,
      projectId: input.projectId,
      entityType: "issue",
      entityId: id,
      href: `/projects/${input.projectId}/tasks`,
    });
  });
}

export async function updateIssue(issueId: string, status: "open" | "in_progress" | "resolved", actorId: string): Promise<void> {
  await gate();
  mutateDatabase((db) => {
    const issue = db.issues.find((item) => item.id === issueId);
    if (!issue) throw new Error("Issue not found");
    issue.status = status;
    activity(db, {
      type: "task_completed",
      title: `Issue ${status.replaceAll("_", " ")}: ${issue.title}`,
      detail: issue.location,
      actorId,
      projectId: issue.projectId,
      entityType: "issue",
      entityId: issueId,
      href: `/projects/${issue.projectId}/tasks`,
    });
  });
}

export async function createDailyReport(input: DailyReportValues, actorId: string, status: ReportStatus): Promise<string> {
  await gate();
  const id = createId("rep");
  mutateDatabase((db) => {
    const photos = input.photoCaption
      ? [{ id: createId("ph"), caption: input.photoCaption, localOnly: true as const }]
      : [];
    db.reports.unshift({
      id,
      companyId,
      projectId: input.projectId,
      authorId: actorId,
      date: input.date,
      weather: input.weather,
      workCompleted: input.workCompleted,
      workPlanned: input.workPlanned,
      labour: [
        { trade: "General", count: input.labourCount },
        ...(input.masonCount ? [{ trade: "Mason", count: input.masonCount }] : []),
        ...(input.helperCount ? [{ trade: "Helper", count: input.helperCount }] : []),
      ],
      materialsNote: input.materialsNote ?? "",
      delays: input.delays ?? "",
      safety: input.safety ?? "",
      defects: input.defects ?? "",
      notes: input.notes ?? "",
      photos,
      status,
    });
    if (status !== "draft") {
      activity(db, {
        type: "report_submitted",
        title: "Daily site report submitted",
        detail: input.workCompleted,
        actorId,
        projectId: input.projectId,
        entityType: "report",
        entityId: id,
        href: "/operations/site-reports",
      });
      notify(db, "New site report", input.workCompleted.slice(0, 120), "/operations/site-reports", "report");
    }
  });
  return id;
}

export async function setReportStatus(reportId: string, status: ReportStatus, actorId: string): Promise<void> {
  await gate();
  mutateDatabase((db) => {
    const report = db.reports.find((item) => item.id === reportId);
    if (!report) throw new Error("Report not found");
    report.status = status;
    if (status === "submitted" || status === "reviewed") {
      activity(db, {
        type: "report_submitted",
        title: status === "reviewed" ? "Site report reviewed" : "Site report submitted",
        detail: report.workCompleted,
        actorId,
        projectId: report.projectId,
        entityType: "report",
        entityId: reportId,
        href: "/operations/site-reports",
      });
    }
  });
}

export async function createMaterialRequest(input: MaterialRequestValues, actorId: string): Promise<string> {
  await gate();
  const id = createId("mr");
  mutateDatabase((db) => {
    const material = db.materials.find((item) => item.id === input.materialId);
    if (!material) throw new Error("Material not found");
    const count = db.materialRequests.length + 24;
    db.materialRequests.unshift({
      id,
      companyId,
      code: `MR-${count}`,
      projectId: input.projectId,
      requesterId: actorId,
      materialId: input.materialId,
      description: material.name,
      quantity: input.quantity,
      unit: material.unit,
      needBy: input.needBy,
      priority: input.priority,
      reason: input.reason,
      status: "submitted",
    });
    activity(db, {
      type: "material_request",
      title: `Material request ${`MR-${count}`}`,
      detail: input.reason,
      actorId,
      projectId: input.projectId,
      entityType: "material_request",
      entityId: id,
      href: "/operations/requests",
    });
  });
  return id;
}

export async function setMaterialRequestStatus(requestId: string, status: MaterialRequestStatus, actorId: string): Promise<void> {
  await gate();
  mutateDatabase((db) => {
    const request = db.materialRequests.find((item) => item.id === requestId);
    if (!request) throw new Error("Request not found");
    request.status = status;
    activity(db, {
      type: "material_request",
      title: `${request.code} ${status.replaceAll("_", " ")}`,
      detail: request.reason,
      actorId,
      projectId: request.projectId,
      entityType: "material_request",
      entityId: requestId,
      href: "/operations/requests",
    });
  });
}

export async function createPurchaseOrderFromRequest(requestId: string, actorId: string): Promise<string> {
  await gate();
  const id = createId("po");
  mutateDatabase((db) => {
    const request = db.materialRequests.find((item) => item.id === requestId);
    if (!request) throw new Error("Request not found");
    if (request.status !== "approved" && request.status !== "submitted") throw new Error("Approve the request before ordering");
    if (request.purchaseOrderId) throw new Error("This request already has a purchase order");
    const material = db.materials.find((item) => item.id === request.materialId);
    if (!material) throw new Error("Material not found");
    const code = `PO-${1067 + db.purchaseOrders.length}`;
    db.purchaseOrders.unshift({
      id,
      companyId,
      code,
      supplierId: material.supplierId,
      projectId: request.projectId,
      materialRequestId: request.id,
      date: DEMO_TODAY,
      expectedDelivery: request.needBy,
      status: "pending_approval",
      lines: [{
        id: createId("pol"),
        materialId: material.id,
        description: material.name,
        unit: request.unit,
        quantity: request.quantity,
        receivedQuantity: 0,
        unitRate: material.lastRate,
        taxRate: 18,
      }],
      notes: "Created from a material request. Pending approval, so it is not a commitment yet.",
    });
    request.status = "ordered";
    request.purchaseOrderId = id;
    db.approvals.unshift({
      id: createId("ap"),
      companyId,
      title: `Approve ${code}`,
      type: "purchase_order",
      entityType: "purchase_order",
      entityId: id,
      projectId: request.projectId,
      requestedById: actorId,
      status: "pending",
      createdAt: stamp(),
      href: "/operations/purchase-orders",
    });
    activity(db, {
      type: "material_request",
      title: `${code} drafted from ${request.code}`,
      detail: "Waiting for approval. Not a commitment yet.",
      actorId,
      projectId: request.projectId,
      entityType: "purchase_order",
      entityId: id,
      href: "/operations/purchase-orders",
    });
  });
  return id;
}

export async function setPurchaseOrderStatus(orderId: string, status: PurchaseOrderStatus, actorId: string): Promise<void> {
  await gate();
  mutateDatabase((db) => {
    const order = db.purchaseOrders.find((item) => item.id === orderId);
    if (!order) throw new Error("Purchase order not found");
    order.status = status;
    if (status === "approved" || status === "ordered") order.approverId = actorId;
    db.approvals.filter((approval) => approval.entityId === orderId && approval.status === "pending").forEach((approval) => {
      approval.status = status === "cancelled" ? "rejected" : "approved";
    });
    activity(db, {
      type: "approval",
      title: `${order.code} is ${status.replaceAll("_", " ")}`,
      detail: status === "approved" || status === "ordered" ? "Open quantity is a commitment, not a payment." : "Updated in the demo.",
      actorId,
      projectId: order.projectId,
      entityType: "purchase_order",
      entityId: orderId,
      href: "/operations/purchase-orders",
    });
  });
}

export async function receivePurchaseOrder(orderId: string, quantities: { lineId: string; quantity: number }[], actorId: string, note: string): Promise<void> {
  await gate();
  mutateDatabase((db) => {
    const order = db.purchaseOrders.find((item) => item.id === orderId);
    if (!order) throw new Error("Purchase order not found");
    if (order.status === "cancelled" || order.status === "draft") throw new Error("This order cannot be received");
    const receivedLines: { lineId: string; quantity: number }[] = [];
    quantities.forEach((entry) => {
      const line = order.lines.find((item) => item.id === entry.lineId);
      if (!line || entry.quantity <= 0) return;
      const room = Math.max(0, line.quantity - line.receivedQuantity);
      const qty = Math.min(room, entry.quantity);
      if (qty <= 0) return;
      line.receivedQuantity += qty;
      receivedLines.push({ lineId: line.id, quantity: qty });
      if (line.materialId) {
        db.movements.push({
          id: createId("mov"),
          companyId,
          materialId: line.materialId,
          projectId: order.projectId,
          quantityDelta: qty,
          reason: `Receipt against ${order.code}`,
          date: DEMO_TODAY,
          purchaseOrderId: order.id,
        });
      }
    });
    if (receivedLines.length === 0) throw new Error("Enter a quantity that is still outstanding");
    const fully = order.lines.every((line) => line.receivedQuantity >= line.quantity);
    order.status = fully ? "received" : "partially_received";
    if (order.materialRequestId) {
      const request = db.materialRequests.find((item) => item.id === order.materialRequestId);
      if (request) request.status = fully ? "received" : "partially_received";
    }
    db.receipts.unshift({ id: createId("gr"), companyId, purchaseOrderId: order.id, date: DEMO_TODAY, receivedById: actorId, lines: receivedLines, note: note || "Simulated receipt. Stock moved only inside this demo." });
    activity(db, {
      type: "material_received",
      title: fully ? `${order.code} fully received` : `${order.code} partly received`,
      detail: "Inventory in this demo was updated. No warehouse system was contacted.",
      actorId,
      projectId: order.projectId,
      entityType: "purchase_order",
      entityId: order.id,
      href: "/operations/purchase-orders",
    });
  });
}

export async function createExpense(input: ExpenseFormValues, actorId: string): Promise<string> {
  await gate();
  const id = createId("ex");
  mutateDatabase((db) => {
    db.expenses.unshift({
      id,
      companyId,
      projectId: input.projectId,
      category: input.category,
      vendorName: input.vendorName,
      date: input.date,
      amount: input.amount,
      paymentStatus: "unpaid",
      submittedById: actorId,
      status: "submitted",
      reference: input.reference,
      notes: input.notes ?? "",
      hasReceipt: input.hasReceipt,
    });
    db.approvals.unshift({
      id: createId("ap"),
      companyId,
      title: `Review expense ${input.reference}`,
      type: "expense",
      entityType: "expense",
      entityId: id,
      projectId: input.projectId,
      requestedById: actorId,
      status: "pending",
      createdAt: stamp(),
      href: "/finance/expenses",
    });
    activity(db, {
      type: "expense_recorded",
      title: `Expense submitted: ${input.vendorName}`,
      detail: "It stays out of actual cost until it is approved.",
      actorId,
      projectId: input.projectId,
      entityType: "expense",
      entityId: id,
      href: "/finance/expenses",
    });
  });
  return id;
}

export async function setExpenseStatus(expenseId: string, status: ExpenseStatus, actorId: string): Promise<void> {
  await gate();
  mutateDatabase((db) => {
    const expense = db.expenses.find((item) => item.id === expenseId);
    if (!expense) throw new Error("Expense not found");
    expense.status = status;
    if (status === "approved") expense.paymentStatus = expense.paymentStatus;
    db.approvals.filter((approval) => approval.entityId === expenseId && approval.status === "pending").forEach((approval) => {
      approval.status = status === "rejected" ? "rejected" : "approved";
    });
    activity(db, {
      type: "expense_recorded",
      title: `Expense ${status}: ${expense.vendorName}`,
      detail: status === "approved" ? "Approved expenses count as actual cost." : "Drafts and rejected items stay out of actual cost.",
      actorId,
      projectId: expense.projectId,
      entityType: "expense",
      entityId: expenseId,
      href: "/finance/expenses",
    });
  });
}

export async function createInvoice(input: InvoiceFormValues, actorId: string): Promise<string> {
  await gate();
  const id = createId("inv");
  mutateDatabase((db) => {
    const number = `INV-NEW-${db.invoices.length + 1}`;
    db.invoices.unshift({
      id,
      companyId,
      number,
      clientId: input.clientId,
      projectId: input.projectId,
      issueDate: input.issueDate,
      dueDate: input.dueDate,
      lines: [{ id: createId("il"), description: input.description, quantity: input.quantity, unitRate: input.unitRate, taxRate: input.taxRate }],
      adjustmentAmount: 0,
      lifecycle: "draft",
      notes: input.notes ?? "Demo invoice. Not a tax invoice and not sent to a client.",
    });
    activity(db, {
      type: "invoice_status",
      title: `${number} drafted`,
      detail: "Draft invoices are not receivables until issued.",
      actorId,
      projectId: input.projectId,
      clientId: input.clientId,
      entityType: "invoice",
      entityId: id,
      href: `/finance/invoices/${id}`,
    });
  });
  return id;
}

export async function issueInvoice(invoiceId: string, actorId: string): Promise<void> {
  await gate();
  mutateDatabase((db) => {
    const invoice = db.invoices.find((item) => item.id === invoiceId);
    if (!invoice) throw new Error("Invoice not found");
    invoice.lifecycle = "issued";
    activity(db, {
      type: "invoice_status",
      title: `${invoice.number} issued in the demo`,
      detail: "No tax invoice was filed and nothing was sent to the client.",
      actorId,
      projectId: invoice.projectId,
      clientId: invoice.clientId,
      entityType: "invoice",
      entityId: invoiceId,
      href: `/finance/invoices/${invoiceId}`,
    });
  });
}

export async function recordInvoicePayment(invoiceId: string, amount: number, method: PaymentMethod, reference: string, actorId: string): Promise<void> {
  await gate();
  if (amount <= 0) throw new Error("Enter a payment amount");
  mutateDatabase((db) => {
    const invoice = db.invoices.find((item) => item.id === invoiceId);
    if (!invoice || invoice.lifecycle !== "issued") throw new Error("Issue the invoice before recording a payment");
    db.payments.unshift({ id: createId("pay"), companyId, invoiceId, amount, date: DEMO_TODAY, method, reference, note: "Simulated collection. No bank was contacted." });
    activity(db, {
      type: "invoice_status",
      title: `Payment recorded on ${invoice.number}`,
      detail: "Balance is recalculated from this demo ledger.",
      actorId,
      projectId: invoice.projectId,
      clientId: invoice.clientId,
      entityType: "invoice",
      entityId: invoiceId,
      href: `/finance/invoices/${invoiceId}`,
    });
  });
}

export async function setVendorBillLifecycle(billId: string, lifecycle: VendorBillLifecycle, actorId: string): Promise<void> {
  await gate();
  mutateDatabase((db) => {
    const bill = db.vendorBills.find((item) => item.id === billId);
    if (!bill) throw new Error("Bill not found");
    bill.lifecycle = lifecycle;
    activity(db, {
      type: "expense_recorded",
      title: `${bill.number} is ${lifecycle.replaceAll("_", " ")}`,
      detail: lifecycle === "approved" ? "Approved bills count as actual cost. Payment is a separate step." : "Unapproved bills stay out of actual cost.",
      actorId,
      projectId: bill.projectId,
      entityType: "vendor_bill",
      entityId: billId,
      href: "/finance/vendor-bills",
    });
  });
}

export async function recordVendorPayment(billId: string, amount: number, method: PaymentMethod, reference: string, actorId: string): Promise<void> {
  await gate();
  if (amount <= 0) throw new Error("Enter a payment amount");
  mutateDatabase((db) => {
    const bill = db.vendorBills.find((item) => item.id === billId);
    if (!bill || bill.lifecycle !== "approved") throw new Error("Approve the bill before recording a payment");
    db.payments.unshift({ id: createId("pay"), companyId, vendorBillId: billId, amount, date: DEMO_TODAY, method, reference, note: "Simulated payment. No bank transfer was made." });
    activity(db, {
      type: "expense_recorded",
      title: `Payment recorded on ${bill.number}`,
      detail: "This reduces the bill balance. It does not change actual cost, which was recognised on approval.",
      actorId,
      projectId: bill.projectId,
      entityType: "vendor_bill",
      entityId: billId,
      href: "/finance/vendor-bills",
    });
  });
}

export async function addLocalDocument(input: { name: string; category: DocumentCategory; projectId?: string; note: string }, actorId: string): Promise<void> {
  await gate();
  mutateDatabase((db) => {
    const id = createId("doc");
    db.documents.unshift({
      id,
      companyId,
      projectId: input.projectId,
      name: input.name,
      category: input.category,
      uploadedById: actorId,
      updatedAt: DEMO_TODAY,
      approval: "none",
      classification: "internal",
      versions: [{ version: 1, at: DEMO_TODAY, byId: actorId, note: input.note || "Local demo file. Not uploaded to a server." }],
      localOnly: true,
    });
    activity(db, {
      type: "document_added",
      title: `Document noted: ${input.name}`,
      detail: "Stored only in this browser demo. Nothing was uploaded.",
      actorId,
      projectId: input.projectId,
      entityType: "document",
      entityId: id,
      href: "/documents",
    });
  });
}

export async function setDocumentApproval(documentId: string, approval: "pending" | "approved" | "rejected", actorId: string): Promise<void> {
  await gate();
  mutateDatabase((db) => {
    const document = db.documents.find((item) => item.id === documentId);
    if (!document) throw new Error("Document not found");
    document.approval = approval;
    document.versions.push({ version: document.versions.length + 1, at: DEMO_TODAY, byId: actorId, note: `Marked ${approval}` });
    activity(db, {
      type: "document_added",
      title: `${document.name} marked ${approval}`,
      detail: "Version note added in the demo.",
      actorId,
      projectId: document.projectId,
      entityType: "document",
      entityId: documentId,
      href: "/documents",
    });
  });
}

export async function markNotificationRead(id: string, read: boolean): Promise<void> {
  await gate(80);
  mutateDatabase((db) => {
    const notification = db.notifications.find((item) => item.id === id);
    if (notification) notification.read = read;
  });
}

export async function markAllNotificationsRead(): Promise<void> {
  await gate(80);
  mutateDatabase((db) => {
    db.notifications.forEach((notification) => {
      notification.read = true;
    });
  });
}

export async function setHandoverItem(itemId: string, done: boolean, actorId: string): Promise<void> {
  await gate();
  mutateDatabase((db) => {
    const item = db.handover.find((entry) => entry.id === itemId);
    if (!item) throw new Error("Checklist item not found");
    item.done = done;
    activity(db, {
      type: "milestone_updated",
      title: `${item.label} ${done ? "done" : "reopened"}`,
      detail: item.note || "Handover checklist updated.",
      actorId,
      projectId: item.projectId,
      entityType: "handover",
      entityId: itemId,
      href: `/projects/${item.projectId}/handover`,
    });
  });
}

export async function setAttendance(input: { projectId: string; userId: string; date: string; status: AttendanceStatus }, actorId: string): Promise<void> {
  await gate();
  mutateDatabase((db) => {
    const existing = db.attendance.find((entry) => entry.projectId === input.projectId && entry.userId === input.userId && entry.date === input.date);
    if (existing) existing.status = input.status;
    else {
      db.attendance.push({ id: createId("att"), companyId, ...input, trade: "Site" });
    }
    activity(db, {
      type: "report_submitted",
      title: "Attendance updated",
      detail: "Operational attendance only. This demo does not calculate payroll.",
      actorId,
      projectId: input.projectId,
      entityType: "attendance",
      entityId: input.userId,
      href: "/team",
    });
  });
}

export async function decideApproval(approvalId: string, decision: "approved" | "rejected", actorId: string): Promise<void> {
  await gate();
  mutateDatabase((db) => {
    const approval = db.approvals.find((item) => item.id === approvalId);
    if (!approval) throw new Error("Approval not found");
    approval.status = decision;
    if (approval.entityType === "purchase_order") {
      const order = db.purchaseOrders.find((item) => item.id === approval.entityId);
      if (order && decision === "approved") {
        order.status = "approved";
        order.approverId = actorId;
      }
      if (order && decision === "rejected") order.status = "cancelled";
    }
    if (approval.entityType === "expense") {
      const expense = db.expenses.find((item) => item.id === approval.entityId);
      if (expense) expense.status = decision === "approved" ? "approved" : "rejected";
    }
    if (approval.entityType === "variation") {
      const variation = db.variations.find((item) => item.id === approval.entityId);
      if (variation) variation.status = decision === "approved" ? "approved" : "rejected";
    }
    if (approval.entityType === "quotation") {
      const quotation = db.quotations.find((item) => item.id === approval.entityId);
      if (quotation && decision === "approved") quotation.status = "approved";
      if (quotation && decision === "rejected") quotation.status = "declined";
    }
    activity(db, {
      type: "approval",
      title: `${approval.title} ${decision}`,
      detail: "Decision recorded in the demo only.",
      actorId,
      projectId: approval.projectId,
      entityType: approval.entityType,
      entityId: approval.entityId,
      href: approval.href,
    });
  });
}

export async function updateSettings(patch: Partial<Database["settings"]>, actorId: string): Promise<void> {
  await gate();
  mutateDatabase((db) => {
    db.settings = { ...db.settings, ...patch };
    if (patch.companyName) db.company.name = patch.companyName;
    activity(db, {
      type: "document_added",
      title: "Workspace settings saved",
      detail: "Preferences live in this browser only.",
      actorId,
      entityType: "settings",
      entityId: "settings",
      href: "/settings",
    });
  });
}

export async function resetDemoData(): Promise<void> {
  await gate(120);
  const { resetDatabase } = await import("@/services/database");
  resetDatabase();
}

export type { ActivityType };
