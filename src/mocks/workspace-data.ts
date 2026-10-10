import type { ActivityEvent, ApprovalRecord, NotificationRecord } from "@/types/activity";
import type { DocumentRecord } from "@/types/documents";
import { at, companyId } from "@/mocks/helpers";

function doc(
  id: string,
  name: string,
  category: DocumentRecord["category"],
  projectId: string,
  clientId: string | undefined,
  uploadedById: string,
  updatedAt: string,
  approval: DocumentRecord["approval"],
  classification: DocumentRecord["classification"],
  versions: DocumentRecord["versions"],
): DocumentRecord {
  return { id, companyId, projectId, clientId, name, category, uploadedById, updatedAt, approval, classification, versions, localOnly: true };
}

export const documents: DocumentRecord[] = [
  doc("doc_01", "Villa 14 architectural set, rev C", "drawings", "proj_villa", "client_rao", "user_divya", "2026-06-02", "approved", "client_shared", [
    { version: 1, at: "2026-03-01", byId: "user_divya", note: "Tender set" },
    { version: 2, at: "2026-06-02", byId: "user_kavya", note: "Courtyard revision" },
  ]),
  doc("doc_02", "Villa 14 contract", "contracts", "proj_villa", "client_rao", "user_meera", "2026-04-02", "approved", "restricted", [{ version: 1, at: "2026-04-02", byId: "user_meera", note: "Signed copy stored locally for the demo." }]),
  doc("doc_03", "Villa 14 BOQ rev 2", "boq", "proj_villa", "client_rao", "user_divya", "2026-03-18", "approved", "internal", [{ version: 1, at: "2026-03-18", byId: "user_divya", note: "Matches EST-WF-014" }]),
  doc("doc_04", "QT-WF-014 accepted quotation", "quotations", "proj_villa", "client_rao", "user_divya", "2026-03-28", "approved", "client_shared", [{ version: 1, at: "2026-03-28", byId: "user_divya", note: "Acceptance scan" }]),
  doc("doc_05", "INV-WF-014-03", "invoices", "proj_villa", "client_rao", "user_rohan", "2026-09-05", "approved", "client_shared", [{ version: 1, at: "2026-09-05", byId: "user_rohan", note: "Issued in the demo ledger" }]),
  doc("doc_06", "Whitefield commencement checklist", "permits", "proj_villa", "client_rao", "user_kavya", "2026-04-06", "approved", "internal", [{ version: 1, at: "2026-04-06", byId: "user_kavya", note: "Local checklist, not a statutory filing." }]),
  doc("doc_07", "Courtyard deck after rain", "site_photos", "proj_villa", "client_rao", "user_arjun", "2026-10-08", "none", "internal", [{ version: 1, at: "2026-10-08", byId: "user_arjun", note: "Demo photo placeholder" }]),
  doc("doc_08", "Saturday client note", "meeting_notes", "proj_villa", "client_rao", "user_kavya", "2026-10-04", "none", "internal", [{ version: 1, at: "2026-10-04", byId: "user_kavya", note: "Delay explained in plain language." }]),
  doc("doc_09", "Tower B GA drawings", "drawings", "proj_lakeside", "client_lakeside", "user_divya", "2026-02-10", "approved", "client_shared", [
    { version: 1, at: "2026-01-05", byId: "user_divya", note: "Issue for construction" },
    { version: 2, at: "2026-02-10", byId: "user_kavya", note: "Lift pit revision" },
  ]),
  doc("doc_10", "Northstar services coordination", "drawings", "proj_koramangala", "client_northstar", "user_nisha", "2026-10-09", "pending", "internal", [{ version: 1, at: "2026-10-09", byId: "user_sanjay", note: "Clash markup. Not a true drawing comparison." }]),
  doc("doc_11", "Server room meeting", "meeting_notes", "proj_koramangala", "client_northstar", "user_nisha", "2026-10-09", "none", "internal", [{ version: 1, at: "2026-10-09", byId: "user_nisha", note: "HVAC and IT both attended." }]),
  doc("doc_12", "Townhouse neighbour letter", "other", "proj_townhouse", "client_iyer", "user_nisha", "2026-10-06", "pending", "restricted", [{ version: 1, at: "2026-10-06", byId: "user_nisha", note: "Draft access note." }]),
  doc("doc_13", "Clinic fire-door schedule", "drawings", "proj_clinic", "client_sagar", "user_nisha", "2026-09-30", "approved", "internal", [
    { version: 1, at: "2026-08-12", byId: "user_divya", note: "Original" },
    { version: 2, at: "2026-09-30", byId: "user_nisha", note: "After the nurse-station move" },
  ]),
  doc("doc_14", "Jayanagar as-built set", "handover", "proj_jayanagar", "client_malhotra", "user_kavya", "2026-10-02", "approved", "client_shared", [{ version: 1, at: "2026-10-02", byId: "user_kavya", note: "Local demo file." }]),
  doc("doc_15", "Master-bath leak photos", "site_photos", "proj_jayanagar", "client_malhotra", "user_arjun", "2026-10-09", "none", "internal", [{ version: 1, at: "2026-10-09", byId: "user_arjun", note: "Shower test" }]),
  doc("doc_16", "Warehouse soil report", "other", "proj_warehouse", "client_helios", "user_nisha", "2026-08-01", "approved", "internal", [{ version: 1, at: "2026-08-01", byId: "user_nisha", note: "Third-party report, filed locally." }]),
  doc("doc_17", "Hebbal site visit notes", "meeting_notes", "proj_villa", "client_menon", "user_divya", "2026-09-12", "none", "internal", [{ version: 1, at: "2026-09-12", byId: "user_arjun", note: "Visit for the open lead, stored against the office for now." }]),
  doc("doc_18", "Kaveri quotation pack", "quotations", "proj_koramangala", "client_kaveri", "user_divya", "2026-09-29", "approved", "client_shared", [{ version: 1, at: "2026-09-29", byId: "user_divya", note: "Marked sent in the demo. No message left SiteFlow." }]),
];

export const activities: ActivityEvent[] = [
  { id: "act_01", companyId, type: "project_created", title: "Villa 14 moved into delivery", detail: "Accepted quotation QT-WF-014 became project ARH-WF-014.", actorId: "user_meera", projectId: "proj_villa", clientId: "client_rao", leadId: "lead_villa", entityType: "project", entityId: "proj_villa", href: "/projects/proj_villa", createdAt: at("2026-04-06", "09:30") },
  { id: "act_02", companyId, type: "quotation_status", title: "Retail quotation marked sent", detail: "QT-KA-009 was marked sent in this demo. No email was delivered.", actorId: "user_divya", clientId: "client_kaveri", leadId: "lead_retail", entityType: "quotation", entityId: "quo_retail", href: "/crm/quotations/quo_retail", createdAt: at("2026-09-29", "16:10") },
  { id: "act_03", companyId, type: "follow_up_logged", title: "Call with Priya Menon", detail: "Studio roof is still undecided.", actorId: "user_divya", leadId: "lead_hebbal", clientId: "client_menon", entityType: "lead", entityId: "lead_hebbal", href: "/crm/leads/lead_hebbal", createdAt: at("2026-10-06", "11:20") },
  { id: "act_04", companyId, type: "estimate_updated", title: "Hebbal BOQ revised", detail: "Version 2 adds the studio mezzanine.", actorId: "user_divya", leadId: "lead_hebbal", clientId: "client_menon", entityType: "estimate", entityId: "est_hebbal", href: "/crm/estimates/est_hebbal", createdAt: at("2026-10-04", "15:00") },
  { id: "act_05", companyId, type: "report_submitted", title: "Daily report, Villa 14", detail: "Steel is still short and the pour is on hold.", actorId: "user_arjun", projectId: "proj_villa", entityType: "report", entityId: "rep_v3", href: "/operations/site-reports", createdAt: at("2026-10-09", "18:05") },
  { id: "act_06", companyId, type: "report_submitted", title: "Daily report, Lakeside", detail: "Floor 6 beam steel continued. Stair rail still open.", actorId: "user_leela", projectId: "proj_lakeside", entityType: "report", entityId: "rep_l2", href: "/operations/site-reports", createdAt: at("2026-10-09", "18:40") },
  { id: "act_07", companyId, type: "material_request", title: "Steel request ordered", detail: "MR-014 became PO-1048 and is still a commitment.", actorId: "user_imran", projectId: "proj_villa", entityType: "material_request", entityId: "mr_01", href: "/operations/requests", createdAt: at("2026-10-03", "12:15") },
  { id: "act_08", companyId, type: "material_received", title: "Aggregate received at the warehouse", detail: "PO-1060 fully received. Commitment cleared.", actorId: "user_sanjay", projectId: "proj_warehouse", entityType: "purchase_order", entityId: "po_06", href: "/operations/purchase-orders", createdAt: at("2026-10-06", "14:20") },
  { id: "act_09", companyId, type: "task_completed", title: "Yard drainage closed", detail: "East access is clear before the next pour.", actorId: "user_sanjay", projectId: "proj_warehouse", entityType: "task", entityId: "task_15", href: "/operations/tasks", createdAt: at("2026-10-05", "17:00") },
  { id: "act_10", companyId, type: "expense_recorded", title: "Villa labour week approved", detail: "₹5,80,000 approved. It counts as actual labour cost.", actorId: "user_rohan", projectId: "proj_villa", entityType: "expense", entityId: "ex_02", href: "/finance/expenses", createdAt: at("2026-10-04", "13:10") },
  { id: "act_11", companyId, type: "invoice_status", title: "RA bill 4 issued for Villa 14", detail: "INV-WF-014-04 is issued and due 28 Oct. This is not a tax invoice from a live system.", actorId: "user_rohan", projectId: "proj_villa", clientId: "client_rao", entityType: "invoice", entityId: "inv_02", href: "/finance/invoices/inv_02", createdAt: at("2026-10-06", "10:45") },
  { id: "act_12", companyId, type: "milestone_updated", title: "First-floor structure slipped", detail: "Planned end 1 Oct has passed and the slab is at 65%.", actorId: "user_kavya", projectId: "proj_villa", entityType: "milestone", entityId: "ms_v4", href: "/projects/proj_villa/schedule", createdAt: at("2026-10-02", "09:00") },
  { id: "act_13", companyId, type: "approval", title: "Carpet tile PO approved", detail: "PO-1055 is an open commitment, not a payment.", actorId: "user_meera", projectId: "proj_koramangala", entityType: "purchase_order", entityId: "po_04", href: "/operations/purchase-orders", createdAt: at("2026-10-05", "11:30") },
  { id: "act_14", companyId, type: "document_added", title: "Clash markup filed", detail: "Local demo file only. Nothing was uploaded to a server.", actorId: "user_sanjay", projectId: "proj_koramangala", entityType: "document", entityId: "doc_10", href: "/documents", createdAt: at("2026-10-09", "19:10") },
  { id: "act_15", companyId, type: "report_submitted", title: "Leak test failed again", detail: "Jayanagar handover stays blocked.", actorId: "user_arjun", projectId: "proj_jayanagar", entityType: "report", entityId: "rep_j2", href: "/projects/proj_jayanagar/handover", createdAt: at("2026-10-09", "16:50") },
  { id: "act_16", companyId, type: "lead_created", title: "Sarjapur duplex enquiry", detail: "Neha Kulkarni asked for a 4-bedroom duplex.", actorId: "user_divya", leadId: "lead_sarjapur", entityType: "lead", entityId: "lead_sarjapur", href: "/crm/leads/lead_sarjapur", createdAt: at("2026-10-08", "09:40") },
  { id: "act_17", companyId, type: "quotation_status", title: "Hebbal quotation in review", detail: "QT-HB-021 has not been sent.", actorId: "user_divya", leadId: "lead_hebbal", clientId: "client_menon", entityType: "quotation", entityId: "quo_hebbal", href: "/crm/quotations/quo_hebbal", createdAt: at("2026-10-05", "17:25") },
  { id: "act_18", companyId, type: "invoice_status", title: "Part payment from Lakeside", detail: "₹50,00,000 received against INV-LS-202-06.", actorId: "user_rohan", projectId: "proj_lakeside", clientId: "client_lakeside", entityType: "invoice", entityId: "inv_03", href: "/finance/invoices/inv_03", createdAt: at("2026-10-01", "15:15") },
  { id: "act_19", companyId, type: "material_request", title: "Block request approved", detail: "MR-015 is approved and still needs a purchase order.", actorId: "user_nisha", projectId: "proj_townhouse", entityType: "material_request", entityId: "mr_02", href: "/operations/requests", createdAt: at("2026-10-07", "10:05") },
  { id: "act_20", companyId, type: "task_completed", title: "Helmets issued", detail: "Twelve new helpers at the warehouse.", actorId: "user_sanjay", projectId: "proj_warehouse", entityType: "task", entityId: "task_22", href: "/operations/tasks", createdAt: at("2026-10-09", "08:30") },
  { id: "act_21", companyId, type: "expense_recorded", title: "Townhouse masonry bill approved", detail: "Vendor bill VB-YARD-019 counts as actual subcontract cost.", actorId: "user_rohan", projectId: "proj_townhouse", entityType: "vendor_bill", entityId: "vb_06", href: "/finance/vendor-bills", createdAt: at("2026-10-04", "12:40") },
  { id: "act_22", companyId, type: "milestone_updated", title: "Floor 6 is the current front", detail: "Lakeside typical floors 5–8 are 55% and still inside the planned window.", actorId: "user_leela", projectId: "proj_lakeside", entityType: "milestone", entityId: "ms_l4", href: "/projects/proj_lakeside/schedule", createdAt: at("2026-10-07", "18:20") },
  { id: "act_23", companyId, type: "document_added", title: "As-built set filed", detail: "Jayanagar handover pack, local copy only.", actorId: "user_kavya", projectId: "proj_jayanagar", clientId: "client_malhotra", entityType: "document", entityId: "doc_14", href: "/documents", createdAt: at("2026-10-02", "11:00") },
  { id: "act_24", companyId, type: "approval", title: "Meeting-room variation waiting", detail: "Koramangala extra room is pending Meera’s decision.", actorId: "user_nisha", projectId: "proj_koramangala", entityType: "variation", entityId: "var_02", href: "/projects/proj_koramangala", createdAt: at("2026-10-02", "16:45") },
  { id: "act_25", companyId, type: "follow_up_logged", title: "Yelahanka site visit", detail: "Filled soil on the north boundary.", actorId: "user_divya", leadId: "lead_yelahanka", entityType: "lead", entityId: "lead_yelahanka", href: "/crm/leads/lead_yelahanka", createdAt: at("2026-10-03", "17:10") },
  { id: "act_26", companyId, type: "report_submitted", title: "Clinic dust barrier adjusted", detail: "Ground floor stayed open for patients.", actorId: "user_leela", projectId: "proj_clinic", entityType: "report", entityId: "rep_c1", href: "/operations/site-reports", createdAt: at("2026-10-08", "19:00") },
];

export const notifications: NotificationRecord[] = [
  { id: "nt_01", companyId, title: "First-floor slab is late", body: "Villa 14 planned to finish structure on 1 Oct. It is still at 65%.", createdAt: at("2026-10-02", "09:05"), read: false, href: "/projects/proj_villa/schedule", kind: "milestone", recipientRole: "owner" },
  { id: "nt_02", companyId, title: "Invoice overdue", body: "INV-WF-014-03 still has a balance and the due date was 28 Sep.", createdAt: at("2026-09-29", "08:00"), read: false, href: "/finance/invoices/inv_01", kind: "invoice", recipientRole: "accountant" },
  { id: "nt_03", companyId, title: "Steel not received", body: "PO-1048 for Villa 14 was expected on 9 Oct.", createdAt: at("2026-10-09", "08:30"), read: false, href: "/operations/purchase-orders", kind: "delivery", recipientRole: "project_manager" },
  { id: "nt_04", companyId, title: "Approval waiting", body: "Prop hire PO-1064 needs a decision before it becomes a commitment.", createdAt: at("2026-10-07", "11:00"), read: false, href: "/operations/purchase-orders", kind: "approval", recipientRole: "owner" },
  { id: "nt_05", companyId, title: "New site report", body: "Arjun submitted the 9 Oct Villa 14 report.", createdAt: at("2026-10-09", "18:06"), read: false, href: "/operations/site-reports", kind: "report", recipientRole: "project_manager" },
  { id: "nt_06", companyId, title: "Task assigned", body: "Floor 6 safety walk is due today.", createdAt: at("2026-10-10", "07:30"), read: false, href: "/operations/tasks", kind: "task", recipientRole: "site_engineer" },
  { id: "nt_07", companyId, title: "Koramangala invoice overdue", body: "INV-KR-088-02 was due on 20 Sep.", createdAt: at("2026-09-21", "08:00"), read: true, href: "/finance/invoices/inv_05", kind: "invoice", recipientRole: "all" },
  { id: "nt_08", companyId, title: "Handover blocked", body: "Jayanagar still has an open master-bath leak.", createdAt: at("2026-10-09", "17:00"), read: false, href: "/projects/proj_jayanagar/handover", kind: "milestone", recipientRole: "all" },
  { id: "nt_09", companyId, title: "Material request needs a PO", body: "MR-015 for AAC blocks is approved and not ordered.", createdAt: at("2026-10-07", "10:10"), read: false, href: "/operations/requests", kind: "delivery", recipientRole: "project_manager" },
  { id: "nt_10", companyId, title: "Follow-up overdue", body: "Kaveri Retail has not replied since the simulated send on 29 Sep.", createdAt: at("2026-10-10", "08:00"), read: false, href: "/crm/leads/lead_retail", kind: "task", recipientRole: "owner" },
  { id: "nt_11", companyId, title: "Bill awaiting review", body: "Airpath HVAC bill is held and is not in actual cost.", createdAt: at("2026-10-06", "12:00"), read: true, href: "/finance/vendor-bills", kind: "approval", recipientRole: "accountant" },
  { id: "nt_12", companyId, title: "Clinic report reviewed", body: "Dust barrier note from 8 Oct is reviewed.", createdAt: at("2026-10-08", "19:20"), read: true, href: "/operations/site-reports", kind: "report", recipientRole: "site_engineer" },
];

export const approvals: ApprovalRecord[] = [
  { id: "ap_01", companyId, title: "Approve prop hire for Villa 14", type: "purchase_order", entityType: "purchase_order", entityId: "po_08", projectId: "proj_villa", requestedById: "user_imran", status: "pending", createdAt: at("2026-10-07", "11:00"), href: "/operations/purchase-orders" },
  { id: "ap_02", companyId, title: "Extra meeting room at Koramangala", type: "variation", entityType: "variation", entityId: "var_02", projectId: "proj_koramangala", requestedById: "user_nisha", status: "pending", createdAt: at("2026-10-02", "16:40"), href: "/projects/proj_koramangala" },
  { id: "ap_03", companyId, title: "Approve petty cash at Villa 14", type: "expense", entityType: "expense", entityId: "ex_24", projectId: "proj_villa", requestedById: "user_arjun", status: "pending", createdAt: at("2026-10-09", "18:30"), href: "/finance/expenses" },
  { id: "ap_04", companyId, title: "Hebbal quotation review", type: "quotation", entityType: "quotation", entityId: "quo_hebbal", requestedById: "user_divya", status: "pending", createdAt: at("2026-10-05", "17:20"), href: "/crm/quotations/quo_hebbal" },
  { id: "ap_05", companyId, title: "Carpet tile commitment", type: "purchase_order", entityType: "purchase_order", entityId: "po_04", projectId: "proj_koramangala", requestedById: "user_imran", status: "approved", createdAt: at("2026-10-05", "11:20"), href: "/operations/purchase-orders" },
];
