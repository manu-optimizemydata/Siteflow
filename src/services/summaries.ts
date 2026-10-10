import {
  actualCost,
  budgetByCategory,
  calculateBillMath,
  calculateEstimateTotals,
  calculateInvoiceMath,
  calculateQuotationTotals,
  committedCost,
  DEMO_TODAY,
  deriveInvoiceStatus,
  deriveProjectHealth,
  displayMilestoneStatus,
  isIssueOverdue,
  isTaskOverdue,
  projectProgress,
  stockOnHand,
} from "@/lib/calculations";
import type { Database } from "@/mocks/types";
import type { AIInsight } from "@/types/activity";
import type { Project, ProjectHealth } from "@/types/project";
import type { UserRole } from "@/types/common";

export interface ProjectFacts {
  project: Project;
  clientName: string;
  managerName: string;
  engineerName: string;
  progress: number;
  health: ProjectHealth;
  budget: number;
  actual: number;
  committed: number;
  variance: number;
  nextMilestoneTitle: string;
  openIssues: number;
  overdueTasks: number;
  receivables: number;
}

export function userName(db: Database, id: string | undefined): string {
  return db.users.find((user) => user.id === id)?.name ?? "Unassigned";
}

export function clientName(db: Database, id: string | undefined): string {
  return db.clients.find((client) => client.id === id)?.name ?? "No client";
}

export function projectFacts(db: Database, project: Project): ProjectFacts {
  const milestones = db.milestones.filter((item) => item.projectId === project.id);
  const expenses = db.expenses.filter((item) => item.projectId === project.id);
  const bills = db.vendorBills.filter((item) => item.projectId === project.id);
  const orders = db.purchaseOrders.filter((item) => item.projectId === project.id);
  const budget = db.budgets.find((item) => item.projectId === project.id);
  const budgetTotal = budget?.lines.reduce((sum, line) => sum + line.amount, 0) ?? 0;
  const actual = actualCost(expenses, bills);
  const openHighIssues = db.issues.filter((issue) => issue.projectId === project.id && issue.status !== "resolved" && issue.severity === "high").length;
  const overdueUrgentTasks = db.tasks.filter((task) => task.projectId === project.id && task.priority === "urgent" && isTaskOverdue(task)).length;
  const next = [...milestones]
    .filter((milestone) => displayMilestoneStatus(milestone) !== "completed")
    .sort((a, b) => a.plannedEnd.localeCompare(b.plannedEnd))[0];
  const receivables = db.invoices
    .filter((invoice) => invoice.projectId === project.id)
    .reduce((sum, invoice) => {
      const math = calculateInvoiceMath(invoice, db.payments.filter((payment) => payment.invoiceId === invoice.id));
      const status = deriveInvoiceStatus(invoice.lifecycle, math, invoice.dueDate);
      if (status === "draft" || status === "cancelled" || status === "paid") return sum;
      return sum + math.balance;
    }, 0);
  return {
    project,
    clientName: clientName(db, project.clientId),
    managerName: userName(db, project.managerId),
    engineerName: userName(db, project.siteEngineerId),
    progress: projectProgress(milestones),
    health: deriveProjectHealth({ project, milestones, budgetAmount: budgetTotal, actualAmount: actual, openHighIssues, overdueUrgentTasks }),
    budget: budgetTotal,
    actual,
    committed: committedCost(orders),
    variance: actual - budgetTotal,
    nextMilestoneTitle: next?.title ?? "No open milestone",
    openIssues: db.issues.filter((issue) => issue.projectId === project.id && issue.status !== "resolved").length,
    overdueTasks: db.tasks.filter((task) => task.projectId === project.id && isTaskOverdue(task)).length,
    receivables,
  };
}

export function allProjectFacts(db: Database): ProjectFacts[] {
  return db.projects.map((project) => projectFacts(db, project));
}

export function categoryCosts(db: Database, projectId: string) {
  return budgetByCategory(
    db.budgets.find((budget) => budget.projectId === projectId),
    db.expenses.filter((expense) => expense.projectId === projectId),
    db.vendorBills.filter((bill) => bill.projectId === projectId),
    db.purchaseOrders.filter((order) => order.projectId === projectId),
  );
}

export interface AttentionItem {
  id: string;
  tone: "danger" | "warning" | "info";
  label: string;
  title: string;
  detail: string;
  href: string;
  projectId?: string;
}

export function attentionItems(db: Database, projectIds?: Set<string>): AttentionItem[] {
  const allow = (projectId?: string) => !projectIds || (projectId ? projectIds.has(projectId) : true);
  const items: AttentionItem[] = [];
  db.followUps
    .filter((followUp) => !followUp.completed && followUp.date <= DEMO_TODAY)
    .forEach((followUp) => {
      const lead = db.leads.find((item) => item.id === followUp.leadId);
      items.push({
        id: followUp.id,
        tone: "warning",
        label: "Overdue",
        title: `Follow up ${lead?.contactName ?? "a lead"}`,
        detail: lead?.title ?? "Lead follow-up",
        href: `/crm/leads/${followUp.leadId}`,
      });
    });
  db.approvals
    .filter((approval) => approval.status === "pending" && allow(approval.projectId))
    .forEach((approval) => {
      items.push({
        id: approval.id,
        tone: "info",
        label: "Awaiting approval",
        title: approval.title,
        detail: "A decision is waiting in this demo.",
        href: approval.href,
        projectId: approval.projectId,
      });
    });
  db.purchaseOrders
    .filter((order) => allow(order.projectId) && (order.status === "ordered" || order.status === "partially_received") && order.expectedDelivery < DEMO_TODAY)
    .forEach((order) => {
      items.push({
        id: order.id,
        tone: "warning",
        label: "Materials late",
        title: `${order.code} is past the expected delivery`,
        detail: "This is still a commitment, not money already spent.",
        href: "/operations/purchase-orders",
        projectId: order.projectId,
      });
    });
  db.issues
    .filter((issue) => allow(issue.projectId) && issue.status !== "resolved" && (issue.severity === "high" || isIssueOverdue(issue)))
    .forEach((issue) => {
      items.push({
        id: issue.id,
        tone: issue.severity === "high" ? "danger" : "warning",
        label: issue.severity === "high" ? "Site issue" : "Overdue",
        title: issue.title,
        detail: issue.location,
        href: `/projects/${issue.projectId}/tasks`,
        projectId: issue.projectId,
      });
    });
  db.invoices.forEach((invoice) => {
    if (!allow(invoice.projectId)) return;
    const math = calculateInvoiceMath(invoice, db.payments.filter((payment) => payment.invoiceId === invoice.id));
    const status = deriveInvoiceStatus(invoice.lifecycle, math, invoice.dueDate);
    if (status === "overdue") {
      items.push({
        id: invoice.id,
        tone: "danger",
        label: "Overdue",
        title: `${invoice.number} is overdue`,
        detail: clientName(db, invoice.clientId),
        href: `/finance/invoices/${invoice.id}`,
        projectId: invoice.projectId,
      });
    }
  });
  db.projects.forEach((project) => {
    if (!allow(project.id)) return;
    const facts = projectFacts(db, project);
    if (facts.variance > 0) {
      items.push({
        id: `budget_${project.id}`,
        tone: "warning",
        label: "Budget warning",
        title: `${project.name} is over budget`,
        detail: "Approved cost is above the budget.",
        href: `/projects/${project.id}/budget`,
        projectId: project.id,
      });
    }
  });
  return items;
}

export function demoInsights(db: Database, role: UserRole): AIInsight[] {
  const facts = allProjectFacts(db);
  const delayed = facts.filter((item) => item.health === "delayed");
  const insights: AIInsight[] = [];
  if (delayed[0]) {
    insights.push({
      id: "insight_delay",
      companyId: db.company.id,
      projectId: delayed[0].project.id,
      tone: "critical",
      title: `${delayed[0].project.name} is behind plan`,
      body: "This message comes from demo data rules, not a live model. A milestone planned end date has passed.",
      href: `/projects/${delayed[0].project.id}`,
      source: "demo_rules",
    });
  }
  const overdueInvoice = attentionItems(db).find((item) => item.href.includes("/finance/invoices"));
  if (overdueInvoice && (role === "owner" || role === "accountant")) {
    insights.push({
      id: "insight_cash",
      companyId: db.company.id,
      tone: "warning",
      title: "Collections need a look",
      body: overdueInvoice.title,
      href: overdueInvoice.href,
      source: "demo_rules",
    });
  }
  return insights;
}

export function invoiceView(db: Database, invoiceId: string) {
  const invoice = db.invoices.find((item) => item.id === invoiceId);
  if (!invoice) return undefined;
  const payments = db.payments.filter((payment) => payment.invoiceId === invoice.id);
  const math = calculateInvoiceMath(invoice, payments);
  return { invoice, payments, math, status: deriveInvoiceStatus(invoice.lifecycle, math, invoice.dueDate) };
}

export function quotationView(db: Database, quotationId: string) {
  const quotation = db.quotations.find((item) => item.id === quotationId);
  if (!quotation) return undefined;
  const estimate = db.estimates.find((item) => item.id === quotation.estimateId);
  if (!estimate) return { quotation, estimate: undefined, totals: undefined };
  const totals = calculateQuotationTotals(calculateEstimateTotals(estimate.items, estimate.contingencyPercent), quotation);
  return { quotation, estimate, totals };
}

export function materialStock(db: Database, materialId: string): number {
  return stockOnHand(db.movements, materialId);
}

export { calculateBillMath, calculateEstimateTotals };
