import type { CompanyId } from "@/types/common";

export type DocumentCategory =
  | "drawings"
  | "contracts"
  | "boq"
  | "quotations"
  | "invoices"
  | "permits"
  | "site_photos"
  | "meeting_notes"
  | "handover"
  | "other";

export type DocumentApproval = "none" | "pending" | "approved" | "rejected";
export type DocumentClassification = "internal" | "client_shared" | "restricted";

export interface DocumentVersion {
  version: number;
  at: string;
  byId: string;
  note: string;
}

export interface DocumentRecord {
  id: string;
  companyId: CompanyId;
  projectId?: string;
  clientId?: string;
  name: string;
  category: DocumentCategory;
  uploadedById: string;
  updatedAt: string;
  approval: DocumentApproval;
  classification: DocumentClassification;
  versions: DocumentVersion[];
  localOnly: true;
}
