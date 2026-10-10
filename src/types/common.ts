export const COMPANY_ID = "co_aarohan" as const;

export type CompanyId = typeof COMPANY_ID;

export interface Address {
  line1: string;
  area: string;
  city: string;
  state: string;
  postalCode: string;
}

export type CostCategoryId =
  | "materials"
  | "labour"
  | "subcontractors"
  | "equipment"
  | "overhead"
  | "other";

export type UserRole = "owner" | "project_manager" | "site_engineer" | "accountant";

export type PermissionKey =
  | "crm.manage"
  | "projects.create"
  | "site.report"
  | "procurement.request"
  | "procurement.manage"
  | "finance.record"
  | "approvals.decide";

export type Priority = "low" | "medium" | "high" | "urgent";

export interface MoneyAmount {
  currency: string;
  amount: number;
}
