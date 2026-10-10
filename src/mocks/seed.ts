import type { Database } from "@/mocks/types";
import { company, settings, users, clients, leads, followUps, siteVisits } from "@/mocks/crm-data";
import { projects, milestones, tasks, issues, variations, budgets, handover } from "@/mocks/project-data";
import { estimates, quotations } from "@/mocks/commercial-data";
import {
  suppliers,
  subcontractors,
  workOrders,
  materials,
  movements,
  materialRequests,
  purchaseOrders,
  receipts,
  reports,
  attendance,
} from "@/mocks/ops-data";
import { expenses, vendorBills, invoices, payments } from "@/mocks/finance-data";
import { documents, activities, notifications, approvals } from "@/mocks/workspace-data";

export function createSeedDatabase(): Database {
  return {
    version: 1,
    company,
    settings,
    users,
    clients,
    leads,
    followUps,
    siteVisits,
    projects,
    milestones,
    tasks,
    issues,
    variations,
    budgets,
    handover,
    estimates,
    quotations,
    suppliers,
    subcontractors,
    workOrders,
    materials,
    movements,
    materialRequests,
    purchaseOrders,
    receipts,
    reports,
    attendance,
    expenses,
    vendorBills,
    invoices,
    payments,
    documents,
    activities,
    notifications,
    approvals,
  };
}
