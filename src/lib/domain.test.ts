import { describe, expect, it } from "vitest";
import {
  actualCost,
  budgetVariance,
  calculateEstimateTotals,
  calculateInvoiceMath,
  canConvertLead,
  committedCost,
  deriveInvoiceStatus,
  deriveProjectHealth,
  displayMilestoneStatus,
  isTaskOverdue,
  projectProgress,
  stockOnHand,
} from "@/lib/calculations";
import type { BOQItem } from "@/types/crm";
import type { Expense, VendorBill } from "@/types/finance";
import type { PurchaseOrder } from "@/types/procurement";
import type { Milestone } from "@/types/project";
import { dailyReportSchema, expenseFormSchema, invoiceFormSchema, leadFormSchema, projectFormSchema } from "@/lib/validation";
import { homeForRole, mobileNavForRole, navigationForRole } from "@/lib/navigation";

const items: BOQItem[] = [
  { id: "a", description: "RCC M25", category: "materials", unit: "cum", quantity: 10, unitRate: 7500, taxRate: 18 },
  { id: "b", description: "Masonry", category: "labour", unit: "sqm", quantity: 20, unitRate: 850, taxRate: 0 },
];

describe("estimate totals", () => {
  it("calculates line-derived subtotal, tax, contingency, and total", () => {
    const totals = calculateEstimateTotals(items, 5);
    expect(totals.subtotal).toBe(92000);
    expect(totals.tax).toBe(13500);
    expect(totals.contingency).toBe(4600);
    expect(totals.total).toBe(110100);
  });
});

describe("invoices", () => {
  const invoice = {
    lines: [{ id: "l", description: "RA bill", quantity: 1, unitRate: 100000, taxRate: 18 }],
    adjustmentAmount: -2000,
  };

  it("derives balance from payments", () => {
    const math = calculateInvoiceMath(invoice, [
      { id: "p", companyId: "co_aarohan", invoiceId: "i", amount: 50000, date: "2026-10-01", method: "upi", reference: "UPI1", note: "" },
    ]);
    expect(math.total).toBe(116000);
    expect(math.paid).toBe(50000);
    expect(math.balance).toBe(66000);
  });

  it("marks overdue only when issued, unpaid, and past due", () => {
    const math = calculateInvoiceMath(invoice, []);
    expect(deriveInvoiceStatus("issued", math, "2026-10-01")).toBe("overdue");
    expect(deriveInvoiceStatus("issued", math, "2026-10-20")).toBe("sent");
    expect(deriveInvoiceStatus("draft", math, "2026-10-01")).toBe("draft");
    const paid = calculateInvoiceMath(invoice, [
      { id: "p", companyId: "co_aarohan", amount: 116000, date: "2026-10-09", method: "bank_transfer", reference: "NEFT", note: "" },
    ]);
    expect(deriveInvoiceStatus("issued", paid, "2026-10-01")).toBe("paid");
  });
});

describe("cost and progress", () => {
  it("interprets variance as actual minus budget", () => {
    expect(budgetVariance(110, 100).direction).toBe("over");
    expect(budgetVariance(90, 100).direction).toBe("under");
  });

  it("counts only open purchase-order quantity as committed", () => {
    const orders: PurchaseOrder[] = [
      {
        id: "po",
        companyId: "co_aarohan",
        code: "PO-1",
        supplierId: "s",
        projectId: "p",
        date: "2026-10-01",
        expectedDelivery: "2026-10-12",
        status: "partially_received",
        lines: [
          { id: "l", description: "Steel", unit: "tonne", quantity: 10, receivedQuantity: 4, unitRate: 60000, taxRate: 18 },
        ],
        notes: "",
      },
      {
        id: "po2",
        companyId: "co_aarohan",
        code: "PO-2",
        supplierId: "s",
        projectId: "p",
        date: "2026-10-01",
        expectedDelivery: "2026-10-12",
        status: "received",
        lines: [{ id: "l", description: "Cement", unit: "bag", quantity: 100, receivedQuantity: 100, unitRate: 400, taxRate: 18 }],
        notes: "",
      },
    ];
    expect(committedCost(orders)).toBe(424800);
  });

  it("uses approved expenses and approved bills as actual", () => {
    const expenses = [{ status: "approved", amount: 1000 }, { status: "draft", amount: 5000 }] as Expense[];
    const bills = [{ lifecycle: "approved", amount: 2000, taxAmount: 360 }, { lifecycle: "draft", amount: 9000, taxAmount: 0 }] as VendorBill[];
    expect(actualCost(expenses, bills)).toBe(3360);
  });

  it("weights milestone progress", () => {
    const milestones = [
      { progress: 100, weight: 1 },
      { progress: 50, weight: 1 },
      { progress: 0, weight: 2 },
    ] as Milestone[];
    expect(projectProgress(milestones)).toBe(38);
  });

  it("derives health from late milestones before budget pressure", () => {
    const health = deriveProjectHealth({
      project: { status: "active" },
      milestones: [
        {
          id: "m",
          companyId: "co_aarohan",
          projectId: "p",
          title: "Structure",
          plannedStart: "2026-09-01",
          plannedEnd: "2026-10-01",
          ownerId: "u",
          status: "in_progress",
          progress: 40,
          weight: 1,
          notes: "",
        },
      ],
      budgetAmount: 100,
      actualAmount: 10,
      openHighIssues: 0,
      overdueUrgentTasks: 0,
    });
    expect(health).toBe("delayed");
    expect(displayMilestoneStatus({
      id: "m",
      companyId: "co_aarohan",
      projectId: "p",
      title: "Structure",
      plannedStart: "2026-09-01",
      plannedEnd: "2026-10-01",
      ownerId: "u",
      status: "in_progress",
      progress: 40,
      weight: 1,
      notes: "",
    })).toBe("late");
  });

  it("flags unfinished tasks before the demo date as overdue", () => {
    expect(isTaskOverdue({ status: "todo", dueDate: "2026-10-01" })).toBe(true);
    expect(isTaskOverdue({ status: "done", dueDate: "2026-10-01" })).toBe(false);
  });
});

describe("lead conversion", () => {
  it("blocks a second project for the same lead", () => {
    expect(canConvertLead({ stage: "won", convertedProjectId: "p1", existingProjectForLead: false }).ok).toBe(false);
    expect(canConvertLead({ stage: "new", existingProjectForLead: false }).ok).toBe(false);
    expect(canConvertLead({ stage: "quotation", existingProjectForLead: false }).ok).toBe(true);
  });
});

describe("inventory", () => {
  it("nets receipts and issues", () => {
    expect(
      stockOnHand(
        [
          { materialId: "m", quantityDelta: 100 },
          { materialId: "m", quantityDelta: -25 },
          { materialId: "other", quantityDelta: 8 },
        ],
        "m",
      ),
    ).toBe(75);
  });
});

describe("forms", () => {
  it("rejects an incomplete lead", () => {
    expect(leadFormSchema.safeParse({ title: "A", contactName: "B", phone: "123", email: "nope", source: "referral", projectType: "villa", area: "X", city: "Bengaluru", estimatedValue: 0, stage: "new", ownerId: "" }).success).toBe(false);
  });

  it("accepts a valid lead phone with spaces", () => {
    const parsed = leadFormSchema.safeParse({
      title: "Hebbal row house",
      contactName: "Anita Rao",
      phone: "98450 11223",
      email: "anita@example.com",
      source: "referral",
      projectType: "independent_house",
      area: "Hebbal",
      city: "Bengaluru",
      estimatedValue: 4500000,
      stage: "new",
      ownerId: "user_divya",
    });
    expect(parsed.success).toBe(true);
  });

  it("rejects a project that ends before it starts", () => {
    const parsed = projectFormSchema.safeParse({
      name: "Test house",
      code: "ARH-1",
      clientId: "c",
      type: "villa",
      area: "Whitefield",
      city: "Bengaluru",
      managerId: "user_kavya",
      siteEngineerId: "user_arjun",
      startDate: "2026-11-01",
      plannedEndDate: "2026-10-01",
      contractValue: 100,
      budget: 80,
      description: "A small test project",
    });
    expect(parsed.success).toBe(false);
  });

  it("validates daily report, expense, and invoice boundaries", () => {
    expect(dailyReportSchema.safeParse({ projectId: "", date: "", weather: "", workCompleted: "short", workPlanned: "short", labourCount: -1 }).success).toBe(false);
    expect(expenseFormSchema.safeParse({ projectId: "p", category: "labour", vendorName: "A", date: "", amount: -1, reference: "", hasReceipt: false }).success).toBe(false);
    expect(invoiceFormSchema.safeParse({
      clientId: "c",
      projectId: "p",
      issueDate: "2026-10-12",
      dueDate: "2026-10-01",
      description: "Running bill",
      quantity: 1,
      unitRate: 10,
      taxRate: 18,
    }).success).toBe(false);
  });
});

describe("navigation", () => {
  it("gives each role a distinct home and mobile set", () => {
    expect(homeForRole("owner")).toBe("/pulse");
    expect(homeForRole("site_engineer")).toBe("/site");
    expect(homeForRole("accountant")).toBe("/finance");
    expect(mobileNavForRole("site_engineer").map((item) => item.href)).toContain("/operations/site-reports");
    expect(navigationForRole("accountant").flatMap((group) => group.items).some((item) => item.href === "/finance/invoices")).toBe(true);
    expect(navigationForRole("site_engineer").flatMap((group) => group.items).some((item) => item.href === "/crm/leads")).toBe(false);
  });
});
