import type { CompanyId, Priority } from "@/types/common";

export interface Supplier {
  id: string;
  companyId: CompanyId;
  name: string;
  category: string;
  contactName: string;
  phone: string;
  email: string;
  city: string;
  paymentTerms: string;
  rating: number;
  notes: string;
}

export interface Subcontractor {
  id: string;
  companyId: CompanyId;
  name: string;
  scope: string;
  contactName: string;
  phone: string;
  email: string;
  city: string;
  paymentTerms: string;
  rating: number;
  notes: string;
}

export type WorkOrderStatus = "draft" | "active" | "completed";
export type WorkOrderPayment = "unbilled" | "billed" | "partial" | "paid";

export interface WorkOrder {
  id: string;
  companyId: CompanyId;
  code: string;
  subcontractorId: string;
  projectId: string;
  scope: string;
  value: number;
  startDate: string;
  endDate: string;
  progress: number;
  status: WorkOrderStatus;
  paymentStatus: WorkOrderPayment;
}

export interface Material {
  id: string;
  companyId: CompanyId;
  code: string;
  name: string;
  category: string;
  unit: string;
  reorderLevel: number;
  averageRate: number;
  lastRate: number;
  supplierId: string;
  location: string;
}

export interface InventoryMovement {
  id: string;
  companyId: CompanyId;
  materialId: string;
  projectId?: string;
  quantityDelta: number;
  reason: string;
  date: string;
  purchaseOrderId?: string;
}

export type MaterialRequestStatus =
  | "draft"
  | "submitted"
  | "approved"
  | "rejected"
  | "ordered"
  | "partially_received"
  | "received";

export interface MaterialRequest {
  id: string;
  companyId: CompanyId;
  code: string;
  projectId: string;
  requesterId: string;
  materialId: string;
  description: string;
  quantity: number;
  unit: string;
  needBy: string;
  priority: Priority;
  reason: string;
  status: MaterialRequestStatus;
  purchaseOrderId?: string;
}

export type PurchaseOrderStatus =
  | "draft"
  | "pending_approval"
  | "approved"
  | "ordered"
  | "partially_received"
  | "received"
  | "cancelled";

export interface PurchaseOrderLine {
  id: string;
  materialId?: string;
  description: string;
  unit: string;
  quantity: number;
  receivedQuantity: number;
  unitRate: number;
  taxRate: number;
}

export interface PurchaseOrder {
  id: string;
  companyId: CompanyId;
  code: string;
  supplierId: string;
  projectId: string;
  materialRequestId?: string;
  date: string;
  expectedDelivery: string;
  status: PurchaseOrderStatus;
  approverId?: string;
  lines: PurchaseOrderLine[];
  notes: string;
}

export interface GoodsReceipt {
  id: string;
  companyId: CompanyId;
  purchaseOrderId: string;
  date: string;
  receivedById: string;
  lines: { lineId: string; quantity: number }[];
  note: string;
}
