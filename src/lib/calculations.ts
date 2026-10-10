import type { CostCategoryId } from "@/types/common";
import type { BOQItem, Quotation } from "@/types/crm";
import type { ClientInvoice, Expense, PaymentRecord, VendorBill } from "@/types/finance";
import type { PurchaseOrder, PurchaseOrderStatus } from "@/types/procurement";
import type { Issue, Milestone, Project, ProjectBudget, ProjectHealth, Task } from "@/types/project";

export const DEMO_TODAY = "2026-10-10";

export function roundMoney(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function lineTotal(quantity: number, unitRate: number): number {
  return roundMoney(quantity * unitRate);
}

export interface EstimateTotals {
  subtotal: number;
  tax: number;
  contingency: number;
  total: number;
}

export function calculateEstimateTotals(items: BOQItem[], contingencyPercent: number): EstimateTotals {
  const subtotal = roundMoney(items.reduce((sum, item) => sum + lineTotal(item.quantity, item.unitRate), 0));
  const tax = roundMoney(
    items.reduce((sum, item) => sum + lineTotal(item.quantity, item.unitRate) * (item.taxRate / 100), 0),
  );
  const contingency = roundMoney(subtotal * (contingencyPercent / 100));
  const total = roundMoney(subtotal + tax + contingency);
  return { subtotal, tax, contingency, total };
}

export interface QuotationTotals extends EstimateTotals {
  discount: number;
  adjustment: number;
  grandTotal: number;
}

export function calculateQuotationTotals(estimate: EstimateTotals, quotation: Pick<Quotation, "discountAmount" | "adjustmentAmount">): QuotationTotals {
  const discount = roundMoney(quotation.discountAmount);
  const adjustment = roundMoney(quotation.adjustmentAmount);
  const grandTotal = roundMoney(estimate.total - discount + adjustment);
  return { ...estimate, discount, adjustment, grandTotal };
}

export interface InvoiceMath {
  subtotal: number;
  tax: number;
  adjustment: number;
  total: number;
  paid: number;
  balance: number;
}

export function calculateInvoiceMath(
  invoice: Pick<ClientInvoice, "lines" | "adjustmentAmount">,
  payments: PaymentRecord[],
): InvoiceMath {
  const subtotal = roundMoney(invoice.lines.reduce((sum, line) => sum + lineTotal(line.quantity, line.unitRate), 0));
  const tax = roundMoney(
    invoice.lines.reduce((sum, line) => sum + lineTotal(line.quantity, line.unitRate) * (line.taxRate / 100), 0),
  );
  const adjustment = roundMoney(invoice.adjustmentAmount);
  const total = roundMoney(Math.max(0, subtotal + tax + adjustment));
  const paid = roundMoney(
    payments.reduce((sum, payment) => sum + payment.amount, 0),
  );
  const balance = roundMoney(Math.max(0, total - paid));
  return { subtotal, tax, adjustment, total, paid, balance };
}

export type DerivedInvoiceStatus = "draft" | "cancelled" | "paid" | "partial" | "overdue" | "sent";

export function deriveInvoiceStatus(
  lifecycle: ClientInvoice["lifecycle"],
  math: Pick<InvoiceMath, "total" | "paid" | "balance">,
  dueDate: string,
  today = DEMO_TODAY,
): DerivedInvoiceStatus {
  if (lifecycle === "cancelled") return "cancelled";
  if (lifecycle === "draft") return "draft";
  if (math.balance <= 0.009) return "paid";
  if (dueDate < today) return "overdue";
  if (math.paid > 0) return "partial";
  return "sent";
}

export function vendorBillTotal(bill: Pick<VendorBill, "amount" | "taxAmount">): number {
  return roundMoney(bill.amount + bill.taxAmount);
}

export interface BillMath {
  total: number;
  paid: number;
  balance: number;
  status: "draft" | "awaiting_review" | "cancelled" | "paid" | "partial" | "overdue" | "approved";
}

export function calculateBillMath(bill: VendorBill, payments: PaymentRecord[], today = DEMO_TODAY): BillMath {
  const total = vendorBillTotal(bill);
  const paid = roundMoney(payments.reduce((sum, payment) => sum + payment.amount, 0));
  const balance = roundMoney(Math.max(0, total - paid));
  if (bill.lifecycle === "draft") return { total, paid, balance, status: "draft" };
  if (bill.lifecycle === "cancelled") return { total, paid, balance, status: "cancelled" };
  if (bill.lifecycle === "awaiting_review") return { total, paid, balance, status: "awaiting_review" };
  if (balance <= 0.009) return { total, paid, balance, status: "paid" };
  if (bill.dueDate < today) return { total, paid, balance, status: "overdue" };
  if (paid > 0) return { total, paid, balance, status: "partial" };
  return { total, paid, balance, status: "approved" };
}

const COMMITTED_PO: PurchaseOrderStatus[] = ["approved", "ordered", "partially_received"];

export function purchaseOrderTotal(order: Pick<PurchaseOrder, "lines">): number {
  return roundMoney(
    order.lines.reduce((sum, line) => {
      const base = lineTotal(line.quantity, line.unitRate);
      return sum + base + roundMoney(base * (line.taxRate / 100));
    }, 0),
  );
}

export function committedCost(orders: PurchaseOrder[]): number {
  return roundMoney(
    orders
      .filter((order) => COMMITTED_PO.includes(order.status))
      .reduce((sum, order) => {
        const outstanding = order.lines.reduce((lineSum, line) => {
          const openQty = Math.max(0, line.quantity - line.receivedQuantity);
          const base = lineTotal(openQty, line.unitRate);
          return lineSum + base + roundMoney(base * (line.taxRate / 100));
        }, 0);
        return sum + outstanding;
      }, 0),
  );
}

export function actualCost(expenses: Expense[], bills: VendorBill[]): number {
  const expenseTotal = expenses
    .filter((expense) => expense.status === "approved")
    .reduce((sum, expense) => sum + expense.amount, 0);
  const billTotal = bills
    .filter((bill) => bill.lifecycle === "approved")
    .reduce((sum, bill) => sum + vendorBillTotal(bill), 0);
  return roundMoney(expenseTotal + billTotal);
}

export interface CategoryCost {
  category: CostCategoryId;
  budget: number;
  actual: number;
  committed: number;
  variance: number;
}

export function budgetByCategory(
  budget: ProjectBudget | undefined,
  expenses: Expense[],
  bills: VendorBill[],
  orders: PurchaseOrder[],
): CategoryCost[] {
  const categories: CostCategoryId[] = ["materials", "labour", "subcontractors", "equipment", "overhead", "other"];
  const materialCommitment = committedCost(orders);
  return categories.map((category) => {
    const budgetAmount = budget?.lines.find((line) => line.category === category)?.amount ?? 0;
    const actual = actualCost(
      expenses.filter((expense) => expense.category === category),
      bills.filter((bill) => bill.category === category),
    );
    const committed = category === "materials" ? materialCommitment : 0;
    return {
      category,
      budget: roundMoney(budgetAmount),
      actual,
      committed,
      variance: roundMoney(actual - budgetAmount),
    };
  });
}

export function budgetVariance(actual: number, budget: number): { variance: number; direction: "over" | "under" | "on_budget" } {
  const variance = roundMoney(actual - budget);
  if (variance > 0.009) return { variance, direction: "over" };
  if (variance < -0.009) return { variance, direction: "under" };
  return { variance: 0, direction: "on_budget" };
}

export function projectProgress(milestones: Milestone[]): number {
  if (milestones.length === 0) return 0;
  const weight = milestones.reduce((sum, milestone) => sum + milestone.weight, 0);
  if (weight <= 0) return 0;
  const weighted = milestones.reduce((sum, milestone) => sum + milestone.progress * milestone.weight, 0);
  return Math.round(weighted / weight);
}

export function displayMilestoneStatus(milestone: Milestone, today = DEMO_TODAY): Milestone["status"] | "late" {
  if (milestone.status === "completed" || milestone.status === "blocked") return milestone.status;
  if (milestone.plannedEnd < today) return "late";
  return milestone.status;
}

export function isTaskOverdue(task: Pick<Task, "status" | "dueDate">, today = DEMO_TODAY): boolean {
  return task.status !== "done" && task.dueDate < today;
}

export function isIssueOverdue(issue: Pick<Issue, "status" | "dueDate">, today = DEMO_TODAY): boolean {
  return issue.status !== "resolved" && issue.dueDate < today;
}

export function deriveProjectHealth(input: {
  project: Pick<Project, "status">;
  milestones: Milestone[];
  budgetAmount: number;
  actualAmount: number;
  openHighIssues: number;
  overdueUrgentTasks: number;
}): ProjectHealth {
  if (input.project.status === "completed") return "completed";
  const late = input.milestones.some((milestone) => displayMilestoneStatus(milestone) === "late");
  if (late || input.project.status === "on_hold") return "delayed";
  const overBudget = input.budgetAmount > 0 && input.actualAmount > input.budgetAmount * 1.02;
  if (overBudget || input.openHighIssues > 0 || input.overdueUrgentTasks > 0) return "at_risk";
  return "on_track";
}

export function stockOnHand(movements: { materialId: string; quantityDelta: number }[], materialId: string): number {
  return roundMoney(
    movements.filter((movement) => movement.materialId === materialId).reduce((sum, movement) => sum + movement.quantityDelta, 0),
  );
}

export function canConvertLead(input: { stage: string; convertedProjectId?: string; existingProjectForLead: boolean }): { ok: true } | { ok: false; reason: string } {
  if (input.convertedProjectId || input.existingProjectForLead) {
    return { ok: false, reason: "This lead is already linked to a project." };
  }
  if (input.stage !== "won" && input.stage !== "negotiation" && input.stage !== "quotation") {
    return { ok: false, reason: "Move the lead to quotation, negotiation, or won before converting." };
  }
  return { ok: true };
}
