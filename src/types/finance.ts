import type { CompanyId, CostCategoryId } from "@/types/common";

export type ExpenseStatus = "draft" | "submitted" | "approved" | "rejected";

export interface Expense {
  id: string;
  companyId: CompanyId;
  projectId: string;
  category: CostCategoryId;
  vendorName: string;
  date: string;
  amount: number;
  paymentStatus: "unpaid" | "paid";
  submittedById: string;
  status: ExpenseStatus;
  reference: string;
  notes: string;
  hasReceipt: boolean;
}

export interface InvoiceLine {
  id: string;
  description: string;
  quantity: number;
  unitRate: number;
  taxRate: number;
}

export type InvoiceLifecycle = "draft" | "issued" | "cancelled";

export interface ClientInvoice {
  id: string;
  companyId: CompanyId;
  number: string;
  clientId: string;
  projectId: string;
  quotationId?: string;
  issueDate: string;
  dueDate: string;
  lines: InvoiceLine[];
  adjustmentAmount: number;
  lifecycle: InvoiceLifecycle;
  notes: string;
}

export type PaymentMethod = "bank_transfer" | "cheque" | "upi" | "cash";

export interface PaymentRecord {
  id: string;
  companyId: CompanyId;
  invoiceId?: string;
  vendorBillId?: string;
  amount: number;
  date: string;
  method: PaymentMethod;
  reference: string;
  note: string;
}

export type VendorBillLifecycle = "draft" | "awaiting_review" | "approved" | "cancelled";

export interface VendorBill {
  id: string;
  companyId: CompanyId;
  number: string;
  partyName: string;
  supplierId?: string;
  subcontractorId?: string;
  projectId: string;
  purchaseOrderId?: string;
  workOrderId?: string;
  category: CostCategoryId;
  issueDate: string;
  dueDate: string;
  amount: number;
  taxAmount: number;
  lifecycle: VendorBillLifecycle;
  notes: string;
}
