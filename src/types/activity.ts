import type { CompanyId, UserRole } from "@/types/common";

export type ActivityType =
  | "lead_created"
  | "follow_up_logged"
  | "estimate_updated"
  | "quotation_status"
  | "project_created"
  | "milestone_updated"
  | "report_submitted"
  | "material_request"
  | "material_received"
  | "task_completed"
  | "expense_recorded"
  | "invoice_status"
  | "document_added"
  | "approval";

export interface ActivityEvent {
  id: string;
  companyId: CompanyId;
  type: ActivityType;
  title: string;
  detail: string;
  actorId: string;
  projectId?: string;
  leadId?: string;
  clientId?: string;
  entityType: string;
  entityId: string;
  href: string;
  createdAt: string;
}

export type NotificationKind =
  | "milestone"
  | "invoice"
  | "delivery"
  | "approval"
  | "report"
  | "task";

export interface NotificationRecord {
  id: string;
  companyId: CompanyId;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
  href: string;
  kind: NotificationKind;
  recipientRole: UserRole | "all";
}

export type ApprovalStatus = "pending" | "approved" | "rejected";

export interface ApprovalRecord {
  id: string;
  companyId: CompanyId;
  title: string;
  type: "quotation" | "purchase_order" | "expense" | "variation";
  entityType: string;
  entityId: string;
  projectId?: string;
  requestedById: string;
  status: ApprovalStatus;
  createdAt: string;
  href: string;
}

export interface AIInsight {
  id: string;
  companyId: CompanyId;
  projectId?: string;
  tone: "info" | "warning" | "critical";
  title: string;
  body: string;
  href: string;
  source: "demo_rules";
}
