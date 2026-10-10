import type { Address, CompanyId, PermissionKey, UserRole } from "@/types/common";

export interface Company {
  id: CompanyId;
  name: string;
  legalName: string;
  city: string;
  state: string;
  phone: string;
  email: string;
  sampleTaxId: string;
}

export interface User {
  id: string;
  companyId: CompanyId;
  name: string;
  role: UserRole;
  jobTitle: string;
  phone: string;
  email: string;
  trade?: string;
  status: "active" | "inactive";
  projectIds: string[];
  avatarHue: number;
}

export interface WorkspaceSettings {
  companyName: string;
  businessType: "residential" | "commercial" | "both";
  region: string;
  currency: string;
  locale: string;
  timezone: string;
  projectScale: "boutique" | "growing" | "multi_site";
  leadStages: LeadStageSetting[];
  projectTypes: { id: string; label: string }[];
  costCategories: { id: string; label: string }[];
  units: string[];
  taxLabel: string;
  notificationPreferences: {
    siteReports: boolean;
    approvals: boolean;
    overdue: boolean;
    digest: boolean;
  };
}

export interface LeadStageSetting {
  id: string;
  label: string;
  order: number;
}

export interface RoleAccessNote {
  role: UserRole;
  permissions: PermissionKey[];
  summary: string;
}

export type ThemePreference = "light" | "dark" | "system";

export interface AddressBookEntry {
  label: string;
  address: Address;
}
