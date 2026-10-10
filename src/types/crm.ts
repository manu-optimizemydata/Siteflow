import type { Address, CompanyId } from "@/types/common";
import type { ProjectType } from "@/types/project";

export type LeadStage =
  | "new"
  | "contacted"
  | "site_visit"
  | "estimation"
  | "quotation"
  | "negotiation"
  | "won"
  | "lost";

export type LeadSource =
  | "referral"
  | "website"
  | "architect"
  | "repeat"
  | "walk_in"
  | "broker";

export interface ContactPerson {
  id: string;
  name: string;
  role: string;
  phone: string;
  email: string;
}

export interface Client {
  id: string;
  companyId: CompanyId;
  name: string;
  kind: "individual" | "organization";
  type: "residential" | "commercial";
  status: "prospect" | "active" | "inactive";
  phone: string;
  email: string;
  location: Address;
  contacts: ContactPerson[];
  notes: string;
}

export interface Lead {
  id: string;
  companyId: CompanyId;
  title: string;
  contactName: string;
  organization: string;
  clientId?: string;
  phone: string;
  email: string;
  source: LeadSource;
  projectType: ProjectType;
  location: Address;
  estimatedValue: number;
  stage: LeadStage;
  ownerId: string;
  nextFollowUp?: string;
  lastContact?: string;
  notes: string;
  createdAt: string;
  convertedProjectId?: string;
}

export interface FollowUp {
  id: string;
  companyId: CompanyId;
  leadId: string;
  date: string;
  type: "call" | "meeting" | "email" | "site_visit";
  notes: string;
  ownerId: string;
  completed: boolean;
}

export interface SiteVisit {
  id: string;
  companyId: CompanyId;
  leadId: string;
  date: string;
  location: string;
  notes: string;
  ownerId: string;
}

export type EstimateStatus = "draft" | "under_review" | "approved" | "archived";

export interface BOQItem {
  id: string;
  description: string;
  category: string;
  unit: string;
  quantity: number;
  unitRate: number;
  taxRate: number;
}

export interface EstimateVersion {
  version: number;
  at: string;
  byId: string;
  note: string;
  items: BOQItem[];
  contingencyPercent: number;
}

export interface Estimate {
  id: string;
  companyId: CompanyId;
  code: string;
  title: string;
  clientId?: string;
  leadId?: string;
  projectId?: string;
  status: EstimateStatus;
  contingencyPercent: number;
  items: BOQItem[];
  versions: EstimateVersion[];
  updatedAt: string;
}

export type QuotationStatus =
  | "draft"
  | "in_review"
  | "approved"
  | "sent"
  | "accepted"
  | "declined"
  | "expired";

export interface Quotation {
  id: string;
  companyId: CompanyId;
  code: string;
  title: string;
  clientId: string;
  leadId?: string;
  projectId?: string;
  estimateId: string;
  version: number;
  status: QuotationStatus;
  issueDate?: string;
  validityDate: string;
  discountAmount: number;
  adjustmentLabel: string;
  adjustmentAmount: number;
  notes: string;
  createdAt: string;
}
