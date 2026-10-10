import type { Address, CompanyId, CostCategoryId, Priority } from "@/types/common";

export type ProjectType =
  | "villa"
  | "apartment"
  | "independent_house"
  | "office_fitout"
  | "commercial"
  | "industrial";

export type ProjectStatus = "planning" | "active" | "on_hold" | "handover" | "completed";

export type ProjectHealth = "on_track" | "at_risk" | "delayed" | "completed";

export interface Project {
  id: string;
  companyId: CompanyId;
  code: string;
  name: string;
  clientId: string;
  type: ProjectType;
  status: ProjectStatus;
  location: Address;
  managerId: string;
  siteEngineerId: string;
  startDate: string;
  plannedEndDate: string;
  contractValue: number;
  sourceLeadId?: string;
  sourceQuotationId?: string;
  description: string;
  image: string;
}

export type MilestoneStatus = "upcoming" | "in_progress" | "blocked" | "completed";

export interface Milestone {
  id: string;
  companyId: CompanyId;
  projectId: string;
  title: string;
  plannedStart: string;
  plannedEnd: string;
  actualStart?: string;
  actualEnd?: string;
  ownerId: string;
  status: MilestoneStatus;
  progress: number;
  dependsOnId?: string;
  weight: number;
  notes: string;
}

export type TaskStatus = "todo" | "in_progress" | "blocked" | "done";

export interface Task {
  id: string;
  companyId: CompanyId;
  projectId: string;
  title: string;
  description: string;
  assigneeId: string;
  createdById: string;
  dueDate: string;
  priority: Priority;
  status: TaskStatus;
  category: "quality" | "schedule" | "procurement" | "safety" | "client" | "admin";
}

export type IssueStatus = "open" | "in_progress" | "resolved";

export interface Issue {
  id: string;
  companyId: CompanyId;
  projectId: string;
  reportId?: string;
  title: string;
  location: string;
  severity: "low" | "medium" | "high";
  category: "defect" | "safety" | "delay" | "quality";
  ownerId: string;
  dueDate: string;
  status: IssueStatus;
  description: string;
}

export interface Variation {
  id: string;
  companyId: CompanyId;
  projectId: string;
  title: string;
  description: string;
  valueDelta: number;
  status: "draft" | "pending_approval" | "approved" | "rejected";
  requestedAt: string;
}

export interface BudgetLine {
  category: CostCategoryId;
  amount: number;
}

export interface ProjectBudget {
  id: string;
  companyId: CompanyId;
  projectId: string;
  lines: BudgetLine[];
}

export type HandoverGroup =
  | "inspection"
  | "defects"
  | "documents"
  | "signoff"
  | "finance"
  | "warranty";

export interface HandoverChecklistItem {
  id: string;
  companyId: CompanyId;
  projectId: string;
  label: string;
  group: HandoverGroup;
  required: boolean;
  done: boolean;
  note: string;
}
