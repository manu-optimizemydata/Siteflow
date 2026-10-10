import { describe, expect, it } from "vitest";
import { calculateInvoiceMath, deriveInvoiceStatus, stockOnHand } from "@/lib/calculations";
import { createSeedDatabase } from "@/mocks/seed";
import { allProjectFacts } from "@/services/summaries";

describe("seed integrity", () => {
  const db = createSeedDatabase();

  it("keeps foreign keys attached to real records", () => {
    const ids = (values: { id: string }[]) => new Set(values.map((value) => value.id));
    const projects = ids(db.projects);
    const clients = ids(db.clients);
    const users = ids(db.users);
    const leads = ids(db.leads);
    const estimates = ids(db.estimates);
    const materials = ids(db.materials);
    db.projects.forEach((project) => {
      expect(clients.has(project.clientId)).toBe(true);
      expect(users.has(project.managerId)).toBe(true);
      expect(users.has(project.siteEngineerId)).toBe(true);
      if (project.sourceLeadId) expect(leads.has(project.sourceLeadId)).toBe(true);
    });
    db.leads.forEach((lead) => {
      if (lead.clientId) expect(clients.has(lead.clientId)).toBe(true);
      if (lead.convertedProjectId) expect(projects.has(lead.convertedProjectId)).toBe(true);
    });
    db.quotations.forEach((quotation) => {
      expect(estimates.has(quotation.estimateId)).toBe(true);
      expect(clients.has(quotation.clientId)).toBe(true);
    });
    db.materialRequests.forEach((request) => {
      expect(materials.has(request.materialId)).toBe(true);
      expect(projects.has(request.projectId)).toBe(true);
    });
    db.tasks.forEach((task) => expect(projects.has(task.projectId)).toBe(true));
    db.reports.forEach((report) => expect(projects.has(report.projectId)).toBe(true));
    expect(db.leads.length).toBeGreaterThanOrEqual(10);
    expect(db.projects.length).toBeGreaterThanOrEqual(6);
    expect(db.tasks.length).toBeGreaterThanOrEqual(20);
    expect(db.reports.length).toBeGreaterThanOrEqual(10);
    expect(db.materials.length).toBeGreaterThanOrEqual(15);
  });

  it("derives a late villa and an over-budget townhouse from the same records", () => {
    const facts = allProjectFacts(db);
    const villa = facts.find((item) => item.project.id === "proj_villa");
    const townhouse = facts.find((item) => item.project.id === "proj_townhouse");
    const lakeside = facts.find((item) => item.project.id === "proj_lakeside");
    expect(villa?.health).toBe("delayed");
    expect(townhouse && townhouse.variance).toBeGreaterThan(0);
    expect(lakeside?.health).toBe("on_track");
  });

  it("does not treat draft invoices as overdue receivables", () => {
    const draft = db.invoices.find((invoice) => invoice.id === "inv_11");
    expect(draft).toBeTruthy();
    if (!draft) return;
    const math = calculateInvoiceMath(draft, []);
    expect(deriveInvoiceStatus(draft.lifecycle, math, draft.dueDate)).toBe("draft");
    const overdue = db.invoices.find((invoice) => invoice.id === "inv_01");
    expect(overdue).toBeTruthy();
    if (!overdue) return;
    const overdueMath = calculateInvoiceMath(overdue, db.payments.filter((payment) => payment.invoiceId === overdue.id));
    expect(deriveInvoiceStatus(overdue.lifecycle, overdueMath, overdue.dueDate)).toBe("overdue");
    expect(overdueMath.balance).toBeGreaterThan(0);
  });

  it("keeps stock as the sum of movements", () => {
    expect(stockOnHand(db.movements, "mat_cement")).toBe(260);
    expect(stockOnHand(db.movements, "mat_helmet")).toBe(12);
  });
});
