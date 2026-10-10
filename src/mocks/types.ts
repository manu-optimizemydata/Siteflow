import type { ActivityEvent, ApprovalRecord, NotificationRecord } from "@/types/activity";
import type { Company, User, WorkspaceSettings } from "@/types/company";
import type { Client, Estimate, FollowUp, Lead, Quotation, SiteVisit } from "@/types/crm";
import type { ClientInvoice, Expense, PaymentRecord, VendorBill } from "@/types/finance";
import type {
  GoodsReceipt,
  InventoryMovement,
  Material,
  MaterialRequest,
  PurchaseOrder,
  Subcontractor,
  Supplier,
  WorkOrder,
} from "@/types/procurement";
import type { HandoverChecklistItem, Issue, Milestone, Project, ProjectBudget, Task, Variation } from "@/types/project";
import type { AttendanceEntry, DailySiteReport } from "@/types/site";
import type { DocumentRecord } from "@/types/documents";

export interface Database {
  version: 1;
  company: Company;
  settings: WorkspaceSettings;
  users: User[];
  clients: Client[];
  leads: Lead[];
  followUps: FollowUp[];
  siteVisits: SiteVisit[];
  projects: Project[];
  milestones: Milestone[];
  tasks: Task[];
  issues: Issue[];
  variations: Variation[];
  budgets: ProjectBudget[];
  handover: HandoverChecklistItem[];
  estimates: Estimate[];
  quotations: Quotation[];
  suppliers: Supplier[];
  subcontractors: Subcontractor[];
  workOrders: WorkOrder[];
  materials: Material[];
  movements: InventoryMovement[];
  materialRequests: MaterialRequest[];
  purchaseOrders: PurchaseOrder[];
  receipts: GoodsReceipt[];
  reports: DailySiteReport[];
  attendance: AttendanceEntry[];
  expenses: Expense[];
  vendorBills: VendorBill[];
  invoices: ClientInvoice[];
  payments: PaymentRecord[];
  documents: DocumentRecord[];
  activities: ActivityEvent[];
  notifications: NotificationRecord[];
  approvals: ApprovalRecord[];
}
