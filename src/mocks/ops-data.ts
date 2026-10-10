import type { DailySiteReport } from "@/types/site";
import type { AttendanceEntry } from "@/types/site";
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
import { companyId } from "@/mocks/helpers";

export const suppliers: Supplier[] = [
  { id: "sup_metro", companyId, name: "Metro Cement & Steel", category: "Cement and steel", contactName: "Prakash Gowda", phone: "9845201001", email: "prakash@metro-cement.example", city: "Bengaluru", paymentTerms: "30 days", rating: 4, notes: "Reliable on cement. Steel rolling dates slip in festival weeks." },
  { id: "sup_nala", companyId, name: "Nala Blocks", category: "Masonry", contactName: "Imtiaz Pasha", phone: "9845201002", email: "imtiaz@nala-blocks.example", city: "Bengaluru", paymentTerms: "15 days", rating: 4, notes: "AAC and concrete blocks. Yard is in Hoskote." },
  { id: "sup_south", companyId, name: "Southbay Aggregates", category: "Aggregates", contactName: "Ramesh Naik", phone: "9845201003", email: "ramesh@southbay.example", city: "Bengaluru", paymentTerms: "Advance on first load", rating: 3, notes: "M-sand and 20 mm jelly." },
  { id: "sup_lotus", companyId, name: "Lotus Electricals", category: "Electrical", contactName: "Deepa Jain", phone: "9845201004", email: "deepa@lotus-electricals.example", city: "Bengaluru", paymentTerms: "45 days", rating: 5, notes: "Cables, DBs, and light fittings." },
  { id: "sup_river", companyId, name: "Riverstone Surfaces", category: "Finishes", contactName: "Anjali Shah", phone: "9845201005", email: "anjali@riverstone.example", city: "Bengaluru", paymentTerms: "50% advance", rating: 4, notes: "Tiles and stone. Lead time is three weeks." },
  { id: "sup_peak", companyId, name: "Peak Formwork Hire", category: "Plant", contactName: "Joseph D’Souza", phone: "9845201006", email: "joseph@peak-formwork.example", city: "Bengaluru", paymentTerms: "Monthly hire", rating: 4, notes: "Cuplock and props." },
  { id: "sup_green", companyId, name: "Greenline Plumbing Mart", category: "Plumbing", contactName: "Suresh Babu", phone: "9845201007", email: "suresh@greenline-plumbing.example", city: "Bengaluru", paymentTerms: "21 days", rating: 4, notes: "CP fittings and pipes." },
  { id: "sup_oak", companyId, name: "Oakline Timber", category: "Carpentry", contactName: "Farooq Ahmed", phone: "9845201008", email: "farooq@oakline.example", city: "Bengaluru", paymentTerms: "30 days", rating: 3, notes: "Plywood and shutters." },
];

export const subcontractors: Subcontractor[] = [
  { id: "sub_helix", companyId, name: "Helix Waterproofing", scope: "Waterproofing", contactName: "Karthik Rao", phone: "9845302001", email: "karthik@helix-wp.example", city: "Bengaluru", paymentTerms: "Against measured bills", rating: 5, notes: "Terrace and wet areas." },
  { id: "sub_mira", companyId, name: "Mira Interiors", scope: "Joinery and ceilings", contactName: "Mira D’Souza", phone: "9845302002", email: "mira@mira-interiors.example", city: "Bengaluru", paymentTerms: "30% / 60% / 10%", rating: 4, notes: "Fit-out joinery." },
  { id: "sub_air", companyId, name: "Airpath HVAC", scope: "HVAC low side", contactName: "Vivek Sharma", phone: "9845302003", email: "vivek@airpath.example", city: "Bengaluru", paymentTerms: "45 days", rating: 3, notes: "Currently in a coordination dispute at Koramangala." },
  { id: "sub_medic", companyId, name: "Medic Gas Systems", scope: "Medical gas", contactName: "Dr. Pooja Iyer", phone: "9845302004", email: "pooja@medic-gas.example", city: "Bengaluru", paymentTerms: "Milestone", rating: 5, notes: "Specialist. One crew for the city." },
  { id: "sub_yard", companyId, name: "Yardline Civil", scope: "Labour masonry gang", contactName: "Manjunath", phone: "9845302005", email: "manjunath@yardline.example", city: "Bengaluru", paymentTerms: "Weekly", rating: 4, notes: "Masonry gang used at the townhouse." },
];

export const workOrders: WorkOrder[] = [
  { id: "wo_1", companyId, code: "WO-WF-03", subcontractorId: "sub_helix", projectId: "proj_villa", scope: "Toilet and terrace waterproofing", value: 680000, startDate: "2026-12-01", endDate: "2027-01-15", progress: 0, status: "draft", paymentStatus: "unbilled" },
  { id: "wo_2", companyId, code: "WO-KR-02", subcontractorId: "sub_mira", projectId: "proj_koramangala", scope: "Partitions, ceilings, and joinery", value: 2400000, startDate: "2026-07-21", endDate: "2026-11-20", progress: 62, status: "active", paymentStatus: "partial" },
  { id: "wo_3", companyId, code: "WO-KR-04", subcontractorId: "sub_air", projectId: "proj_koramangala", scope: "HVAC low side", value: 3100000, startDate: "2026-08-15", endDate: "2026-11-30", progress: 48, status: "active", paymentStatus: "billed" },
  { id: "wo_4", companyId, code: "WO-HS-01", subcontractorId: "sub_medic", projectId: "proj_clinic", scope: "Medical gas piping", value: 860000, startDate: "2026-10-20", endDate: "2026-11-10", progress: 10, status: "active", paymentStatus: "unbilled" },
  { id: "wo_5", companyId, code: "WO-IN-02", subcontractorId: "sub_yard", projectId: "proj_townhouse", scope: "AAC masonry", value: 540000, startDate: "2026-09-01", endDate: "2026-10-20", progress: 80, status: "active", paymentStatus: "partial" },
];

export const materials: Material[] = [
  { id: "mat_cement", companyId, code: "CEM-OPC-53", name: "OPC 53 grade cement", category: "Cement", unit: "bag", reorderLevel: 200, averageRate: 390, lastRate: 405, supplierId: "sup_metro", location: "Whitefield yard" },
  { id: "mat_steel12", companyId, code: "TMT-12", name: "TMT bar 12 mm", category: "Steel", unit: "tonne", reorderLevel: 4, averageRate: 67000, lastRate: 68500, supplierId: "sup_metro", location: "Whitefield yard" },
  { id: "mat_steel8", companyId, code: "TMT-8", name: "TMT bar 8 mm", category: "Steel", unit: "tonne", reorderLevel: 2, averageRate: 69000, lastRate: 70200, supplierId: "sup_metro", location: "Hebbal yard" },
  { id: "mat_aac", companyId, code: "AAC-600", name: "AAC blocks 600 mm", category: "Masonry", unit: "nos", reorderLevel: 400, averageRate: 62, lastRate: 64, supplierId: "sup_nala", location: "Indiranagar site" },
  { id: "mat_sand", companyId, code: "MSAND", name: "Manufactured sand", category: "Aggregates", unit: "cum", reorderLevel: 20, averageRate: 1450, lastRate: 1500, supplierId: "sup_south", location: "Hebbal yard" },
  { id: "mat_jelly", companyId, code: "JELLY-20", name: "20 mm coarse aggregate", category: "Aggregates", unit: "cum", reorderLevel: 15, averageRate: 1380, lastRate: 1420, supplierId: "sup_south", location: "Electronic City" },
  { id: "mat_cable", companyId, code: "CABLE-2.5", name: "FRLS copper cable 2.5 sqmm", category: "Electrical", unit: "metre", reorderLevel: 300, averageRate: 42, lastRate: 46, supplierId: "sup_lotus", location: "Koramangala store" },
  { id: "mat_db", companyId, code: "DB-12", name: "12-way distribution board", category: "Electrical", unit: "nos", reorderLevel: 4, averageRate: 2800, lastRate: 2950, supplierId: "sup_lotus", location: "Koramangala store" },
  { id: "mat_tile", companyId, code: "VIT-600", name: "Vitrified tile 600×600", category: "Finishes", unit: "sqft", reorderLevel: 400, averageRate: 78, lastRate: 82, supplierId: "sup_river", location: "Jayanagar" },
  { id: "mat_vinyl", companyId, code: "VIN-MED", name: "Medical-grade vinyl", category: "Finishes", unit: "sqm", reorderLevel: 40, averageRate: 1450, lastRate: 1520, supplierId: "sup_river", location: "HSR store" },
  { id: "mat_prop", companyId, code: "PROP-3", name: "Adjustable prop 3 m", category: "Plant", unit: "nos", reorderLevel: 40, averageRate: 18, lastRate: 18, supplierId: "sup_peak", location: "Hire pool" },
  { id: "mat_ply", companyId, code: "PLY-18", name: "Film-faced plywood 18 mm", category: "Formwork", unit: "nos", reorderLevel: 30, averageRate: 1650, lastRate: 1720, supplierId: "sup_oak", location: "Whitefield yard" },
  { id: "mat_cpvc", companyId, code: "CPVC-1", name: "CPVC pipe 1 inch", category: "Plumbing", unit: "metre", reorderLevel: 80, averageRate: 95, lastRate: 98, supplierId: "sup_green", location: "HSR store" },
  { id: "mat_paint", companyId, code: "PAINT-EXT", name: "Exterior emulsion", category: "Paint", unit: "litre", reorderLevel: 40, averageRate: 320, lastRate: 335, supplierId: "sup_river", location: "Jayanagar" },
  { id: "mat_cover", companyId, code: "COVER-25", name: "Cover block 25 mm", category: "Sundries", unit: "nos", reorderLevel: 500, averageRate: 2, lastRate: 2, supplierId: "sup_metro", location: "Whitefield yard" },
  { id: "mat_binding", companyId, code: "BIND-18", name: "Binding wire", category: "Steel", unit: "kg", reorderLevel: 50, averageRate: 95, lastRate: 98, supplierId: "sup_metro", location: "Hebbal yard" },
  { id: "mat_door", companyId, code: "DOOR-FLUSH", name: "Flush door shutter 35 mm", category: "Joinery", unit: "nos", reorderLevel: 6, averageRate: 2800, lastRate: 2950, supplierId: "sup_oak", location: "Koramangala store" },
  { id: "mat_helmet", companyId, code: "PPE-HELM", name: "Safety helmet", category: "Safety", unit: "nos", reorderLevel: 20, averageRate: 180, lastRate: 180, supplierId: "sup_peak", location: "Central store" },
];

export const movements: InventoryMovement[] = [
  { id: "mov_01", companyId, materialId: "mat_cement", quantityDelta: 480, reason: "Opening balance", date: "2026-09-01" },
  { id: "mov_02", companyId, materialId: "mat_cement", quantityDelta: -220, reason: "Issued to Villa 14", date: "2026-09-18", projectId: "proj_villa" },
  { id: "mov_03", companyId, materialId: "mat_steel12", quantityDelta: 6.5, reason: "Opening balance", date: "2026-09-01" },
  { id: "mov_04", companyId, materialId: "mat_steel12", quantityDelta: -4.2, reason: "Issued to Villa 14", date: "2026-09-28", projectId: "proj_villa" },
  { id: "mov_05", companyId, materialId: "mat_steel8", quantityDelta: 3.2, reason: "Opening balance", date: "2026-09-01" },
  { id: "mov_06", companyId, materialId: "mat_aac", quantityDelta: 900, reason: "Opening balance", date: "2026-09-01" },
  { id: "mov_07", companyId, materialId: "mat_aac", quantityDelta: -640, reason: "Issued to townhouse", date: "2026-09-22", projectId: "proj_townhouse" },
  { id: "mov_08", companyId, materialId: "mat_sand", quantityDelta: 46, reason: "Opening balance", date: "2026-09-01" },
  { id: "mov_09", companyId, materialId: "mat_sand", quantityDelta: -18, reason: "Issued to Lakeside", date: "2026-10-02", projectId: "proj_lakeside" },
  { id: "mov_10", companyId, materialId: "mat_jelly", quantityDelta: 38, reason: "Opening balance", date: "2026-09-01" },
  { id: "mov_11", companyId, materialId: "mat_cable", quantityDelta: 850, reason: "Opening balance", date: "2026-09-01" },
  { id: "mov_12", companyId, materialId: "mat_cable", quantityDelta: -420, reason: "Issued to Koramangala", date: "2026-09-30", projectId: "proj_koramangala" },
  { id: "mov_13", companyId, materialId: "mat_db", quantityDelta: 10, reason: "Opening balance", date: "2026-09-01" },
  { id: "mov_14", companyId, materialId: "mat_tile", quantityDelta: 1200, reason: "Opening balance", date: "2026-09-01" },
  { id: "mov_15", companyId, materialId: "mat_vinyl", quantityDelta: 80, reason: "Opening balance", date: "2026-09-15" },
  { id: "mov_16", companyId, materialId: "mat_prop", quantityDelta: 120, reason: "Hire pool opening", date: "2026-08-01" },
  { id: "mov_17", companyId, materialId: "mat_ply", quantityDelta: 70, reason: "Opening balance", date: "2026-09-01" },
  { id: "mov_18", companyId, materialId: "mat_ply", quantityDelta: -36, reason: "Issued to Villa 14", date: "2026-10-01", projectId: "proj_villa" },
  { id: "mov_19", companyId, materialId: "mat_cpvc", quantityDelta: 160, reason: "Opening balance", date: "2026-09-01" },
  { id: "mov_20", companyId, materialId: "mat_paint", quantityDelta: 90, reason: "Opening balance", date: "2026-09-01" },
  { id: "mov_21", companyId, materialId: "mat_cover", quantityDelta: 2000, reason: "Opening balance", date: "2026-09-01" },
  { id: "mov_22", companyId, materialId: "mat_binding", quantityDelta: 40, reason: "Opening balance", date: "2026-09-01" },
  { id: "mov_23", companyId, materialId: "mat_door", quantityDelta: 14, reason: "Opening balance", date: "2026-09-10" },
  { id: "mov_24", companyId, materialId: "mat_helmet", quantityDelta: 36, reason: "Opening balance", date: "2026-09-01" },
  { id: "mov_25", companyId, materialId: "mat_helmet", quantityDelta: -24, reason: "Issued to warehouse crew", date: "2026-10-08", projectId: "proj_warehouse" },
];

export const materialRequests: MaterialRequest[] = [
  { id: "mr_01", companyId, code: "MR-014", projectId: "proj_villa", requesterId: "user_arjun", materialId: "mat_steel12", description: "12 mm bars for the courtyard band", quantity: 4, unit: "tonne", needBy: "2026-10-08", priority: "urgent", reason: "First-floor pour cannot close without this lot.", status: "ordered", purchaseOrderId: "po_02" },
  { id: "mr_02", companyId, code: "MR-015", projectId: "proj_townhouse", requesterId: "user_arjun", materialId: "mat_aac", description: "AAC blocks for the west wall", quantity: 180, unit: "nos", needBy: "2026-10-12", priority: "high", reason: "Courtyard revision increased the wall area.", status: "approved" },
  { id: "mr_03", companyId, code: "MR-016", projectId: "proj_lakeside", requesterId: "user_leela", materialId: "mat_cement", description: "Cement for floor 6", quantity: 400, unit: "bag", needBy: "2026-10-16", priority: "high", reason: "Pour planned for 18 Oct.", status: "submitted" },
  { id: "mr_04", companyId, code: "MR-017", projectId: "proj_koramangala", requesterId: "user_sanjay", materialId: "mat_cable", description: "2.5 sqmm cable for the server room rework", quantity: 250, unit: "metre", needBy: "2026-10-14", priority: "high", reason: "Reroute after the duct clash.", status: "draft" },
  { id: "mr_05", companyId, code: "MR-018", projectId: "proj_clinic", requesterId: "user_leela", materialId: "mat_vinyl", description: "Vinyl for the procedure room", quantity: 60, unit: "sqm", needBy: "2026-10-28", priority: "medium", reason: "Finishes start once services are tested.", status: "submitted" },
  { id: "mr_06", companyId, code: "MR-019", projectId: "proj_warehouse", requesterId: "user_sanjay", materialId: "mat_jelly", description: "20 mm aggregate for grid C", quantity: 18, unit: "cum", needBy: "2026-10-11", priority: "medium", reason: "Pedestal pour.", status: "received", purchaseOrderId: "po_06" },
  { id: "mr_07", companyId, code: "MR-020", projectId: "proj_jayanagar", requesterId: "user_arjun", materialId: "mat_cpvc", description: "CPVC to replace the niche branch", quantity: 12, unit: "metre", needBy: "2026-10-09", priority: "urgent", reason: "Leak repair in the master bath.", status: "partially_received", purchaseOrderId: "po_07" },
  { id: "mr_08", companyId, code: "MR-021", projectId: "proj_villa", requesterId: "user_arjun", materialId: "mat_cover", description: "Cover blocks", quantity: 500, unit: "nos", needBy: "2026-10-07", priority: "low", reason: "Cover was short at the last pour.", status: "received", purchaseOrderId: "po_01" },
  { id: "mr_09", companyId, code: "MR-022", projectId: "proj_lakeside", requesterId: "user_leela", materialId: "mat_binding", description: "Binding wire", quantity: 80, unit: "kg", needBy: "2026-10-15", priority: "medium", reason: "Stock is under the reorder level.", status: "rejected" },
  { id: "mr_10", companyId, code: "MR-023", projectId: "proj_koramangala", requesterId: "user_sanjay", materialId: "mat_door", description: "Flush shutters for meeting rooms", quantity: 8, unit: "nos", needBy: "2026-10-30", priority: "medium", reason: "Joinery package.", status: "approved" },
];

export const purchaseOrders: PurchaseOrder[] = [
  {
    id: "po_01", companyId, code: "PO-1041", supplierId: "sup_metro", projectId: "proj_villa", materialRequestId: "mr_08", date: "2026-09-20", expectedDelivery: "2026-09-28", status: "received", approverId: "user_kavya",
    lines: [{ id: "pol_01", materialId: "mat_cover", description: "Cover block 25 mm", unit: "nos", quantity: 2000, receivedQuantity: 2000, unitRate: 2, taxRate: 18 }],
    notes: "Fully received into the Whitefield yard.",
  },
  {
    id: "po_02", companyId, code: "PO-1048", supplierId: "sup_metro", projectId: "proj_villa", materialRequestId: "mr_01", date: "2026-10-03", expectedDelivery: "2026-10-09", status: "ordered", approverId: "user_kavya",
    lines: [{ id: "pol_02", materialId: "mat_steel12", description: "TMT bar 12 mm", unit: "tonne", quantity: 4, receivedQuantity: 0, unitRate: 68500, taxRate: 18 }],
    notes: "Yard promised 9 Oct. Still open, so the value stays committed.",
  },
  {
    id: "po_03", companyId, code: "PO-1052", supplierId: "sup_lotus", projectId: "proj_koramangala", date: "2026-09-12", expectedDelivery: "2026-09-26", status: "received", approverId: "user_nisha",
    lines: [{ id: "pol_03", materialId: "mat_cable", description: "FRLS cable 2.5 sqmm", unit: "metre", quantity: 800, receivedQuantity: 800, unitRate: 46, taxRate: 18 }],
    notes: "Received. A vendor bill carries the actual cost.",
  },
  {
    id: "po_04", companyId, code: "PO-1055", supplierId: "sup_river", projectId: "proj_koramangala", date: "2026-10-04", expectedDelivery: "2026-10-24", status: "approved", approverId: "user_meera",
    lines: [{ id: "pol_04", materialId: "mat_tile", description: "Carpet tile equivalent shade hold", unit: "sqm", quantity: 120, receivedQuantity: 0, unitRate: 2100, taxRate: 18 }],
    notes: "Approved commitment. Not a payment.",
  },
  {
    id: "po_05", companyId, code: "PO-1058", supplierId: "sup_nala", projectId: "proj_lakeside", date: "2026-09-25", expectedDelivery: "2026-10-08", status: "partially_received", approverId: "user_kavya",
    lines: [{ id: "pol_05", materialId: "mat_aac", description: "AAC blocks", unit: "nos", quantity: 2000, receivedQuantity: 1200, unitRate: 64, taxRate: 18 }],
    notes: "800 blocks still to come.",
  },
  {
    id: "po_06", companyId, code: "PO-1060", supplierId: "sup_south", projectId: "proj_warehouse", materialRequestId: "mr_06", date: "2026-10-02", expectedDelivery: "2026-10-06", status: "received", approverId: "user_nisha",
    lines: [{ id: "pol_06", materialId: "mat_jelly", description: "20 mm aggregate", unit: "cum", quantity: 18, receivedQuantity: 18, unitRate: 1420, taxRate: 18 }],
    notes: "Received at Electronic City.",
  },
  {
    id: "po_07", companyId, code: "PO-1062", supplierId: "sup_green", projectId: "proj_jayanagar", materialRequestId: "mr_07", date: "2026-10-06", expectedDelivery: "2026-10-08", status: "partially_received", approverId: "user_kavya",
    lines: [{ id: "pol_07", materialId: "mat_cpvc", description: "CPVC pipe 1 inch", unit: "metre", quantity: 12, receivedQuantity: 6, unitRate: 98, taxRate: 18 }],
    notes: "Half the branch pipe has arrived.",
  },
  {
    id: "po_08", companyId, code: "PO-1064", supplierId: "sup_peak", projectId: "proj_villa", date: "2026-10-07", expectedDelivery: "2026-10-18", status: "pending_approval",
    lines: [{ id: "pol_08", materialId: "mat_prop", description: "Prop hire, October", unit: "nos", quantity: 40, receivedQuantity: 0, unitRate: 18, taxRate: 18 }],
    notes: "Waiting for Meera. Not a commitment until approved.",
  },
  {
    id: "po_09", companyId, code: "PO-0994", supplierId: "sup_oak", projectId: "proj_townhouse", date: "2026-08-02", expectedDelivery: "2026-08-20", status: "cancelled",
    lines: [{ id: "pol_09", materialId: "mat_ply", description: "Plywood, cancelled lot", unit: "nos", quantity: 20, receivedQuantity: 0, unitRate: 1720, taxRate: 18 }],
    notes: "Cancelled after the courtyard redesign.",
  },
  {
    id: "po_10", companyId, code: "PO-1066", supplierId: "sup_metro", projectId: "proj_lakeside", date: "2026-10-08", expectedDelivery: "2026-10-15", status: "draft",
    lines: [{ id: "pol_10", materialId: "mat_cement", description: "OPC 53 grade", unit: "bag", quantity: 400, receivedQuantity: 0, unitRate: 405, taxRate: 18 }],
    notes: "Draft from the floor 6 request. Not yet submitted.",
  },
];

export const receipts: GoodsReceipt[] = [
  { id: "gr_01", companyId, purchaseOrderId: "po_01", date: "2026-09-27", receivedById: "user_arjun", lines: [{ lineId: "pol_01", quantity: 2000 }], note: "Counted at the yard gate." },
  { id: "gr_02", companyId, purchaseOrderId: "po_03", date: "2026-09-25", receivedById: "user_sanjay", lines: [{ lineId: "pol_03", quantity: 800 }], note: "Stored in the fit-out cage." },
  { id: "gr_03", companyId, purchaseOrderId: "po_05", date: "2026-10-06", receivedById: "user_leela", lines: [{ lineId: "pol_05", quantity: 1200 }], note: "Balance expected this week." },
  { id: "gr_04", companyId, purchaseOrderId: "po_06", date: "2026-10-06", receivedById: "user_sanjay", lines: [{ lineId: "pol_06", quantity: 18 }], note: "Weighbridge slip filed locally." },
  { id: "gr_05", companyId, purchaseOrderId: "po_07", date: "2026-10-08", receivedById: "user_arjun", lines: [{ lineId: "pol_07", quantity: 6 }], note: "Short receipt. Not a completed delivery." },
];

function report(partial: Omit<DailySiteReport, "companyId" | "photos"> & { photos?: DailySiteReport["photos"] }): DailySiteReport {
  return { companyId, photos: partial.photos ?? [], ...partial };
}

export const reports: DailySiteReport[] = [
  report({ id: "rep_v1", projectId: "proj_villa", authorId: "user_arjun", date: "2026-10-06", weather: "Clear, 29°C", workCompleted: "Tied starter bars on grid B and checked cover on the courtyard band.", workPlanned: "Continue steel if the 12 mm lot arrives.", labour: [{ trade: "Bar bender", count: 6 }, { trade: "Helper", count: 8 }], materialsNote: "Cover blocks received.", delays: "Steel still short.", safety: "Edge line is intact.", defects: "", notes: "Client not on site.", status: "reviewed", photos: [{ id: "ph_v1", caption: "Courtyard steel, looking west", localOnly: true }] }),
  report({ id: "rep_v2", projectId: "proj_villa", authorId: "user_arjun", date: "2026-10-08", weather: "Light rain after 4 pm", workCompleted: "Fixed cover and stopped work when rain started.", workPlanned: "Pour only if steel lands tomorrow morning.", labour: [{ trade: "Bar bender", count: 5 }, { trade: "Helper", count: 6 }], materialsNote: "No new steel.", delays: "Rain plus the open purchase order.", safety: "Slippery deck. Work stopped at 4.", defects: "", notes: "", status: "submitted", photos: [{ id: "ph_v2", caption: "Deck after the rain stop", localOnly: true }] }),
  report({ id: "rep_v3", projectId: "proj_villa", authorId: "user_arjun", date: "2026-10-09", weather: "Cloudy", workCompleted: "Re-measured the short bars with Imran on a call.", workPlanned: "Hold the pour.", labour: [{ trade: "Bar bender", count: 4 }, { trade: "Helper", count: 4 }], materialsNote: "", delays: "PO-1048 not received.", safety: "No new observation.", defects: "", notes: "Issue left open.", status: "submitted" }),
  report({ id: "rep_l1", projectId: "proj_lakeside", authorId: "user_leela", date: "2026-10-07", weather: "Clear", workCompleted: "Floor 5 deshuttered. Floor 6 beam bottoms fixed.", workPlanned: "Beam steel and a safety walk.", labour: [{ trade: "Carpenter", count: 14 }, { trade: "Bar bender", count: 10 }, { trade: "Helper", count: 18 }], materialsNote: "M-sand issued from the yard.", delays: "", safety: "One stair flight still needs a mid-rail.", defects: "", notes: "", status: "reviewed" }),
  report({ id: "rep_l2", projectId: "proj_lakeside", authorId: "user_leela", date: "2026-10-09", weather: "Humid, 27°C", workCompleted: "Continued floor 6 beam steel. Raised the stair-rail issue again.", workPlanned: "Close the mid-rail before the Saturday pour prep.", labour: [{ trade: "Carpenter", count: 12 }, { trade: "Bar bender", count: 11 }, { trade: "Helper", count: 16 }], materialsNote: "Binding wire is thin.", delays: "", safety: "Mid-rail still open on floor 5.", defects: "", notes: "", status: "submitted", photos: [{ id: "ph_l2", caption: "Floor 5 stair opening", localOnly: true }] }),
  report({ id: "rep_k1", projectId: "proj_koramangala", authorId: "user_sanjay", date: "2026-10-06", weather: "Indoor, AC off in the zone", workCompleted: "Closed ceilings on the east bay. Server room left open.", workPlanned: "Coordination meeting on the duct.", labour: [{ trade: "Gypsum fitter", count: 6 }, { trade: "Helper", count: 3 }], materialsNote: "", delays: "Server room clash.", safety: "Night work permit is with the building.", defects: "", notes: "Noisy work ended by 7 pm.", status: "reviewed" }),
  report({ id: "rep_k2", projectId: "proj_koramangala", authorId: "user_sanjay", date: "2026-10-09", weather: "Indoor", workCompleted: "Marked the conflicting duct and tray on the ceiling.", workPlanned: "Wait for Nisha’s decision before ordering extra cable.", labour: [{ trade: "HVAC fitter", count: 3 }, { trade: "Electrician", count: 2 }], materialsNote: "Cable request is still a draft.", delays: "Coordination.", safety: "Ladders tagged.", defects: "Duct clash photographed.", notes: "", status: "submitted", photos: [{ id: "ph_k2", caption: "Server room services clash", localOnly: true }] }),
  report({ id: "rep_t1", projectId: "proj_townhouse", authorId: "user_arjun", date: "2026-10-07", weather: "Clear", workCompleted: "West wall AAC up to lintel, except the shortfall.", workPlanned: "Chase the block reorder.", labour: [{ trade: "Mason", count: 4 }, { trade: "Helper", count: 3 }], materialsNote: "180 blocks short.", delays: "Material request is approved but not ordered.", safety: "Loose prop was reset yesterday.", defects: "", notes: "", status: "submitted" }),
  report({ id: "rep_c1", projectId: "proj_clinic", authorId: "user_leela", date: "2026-10-08", weather: "Indoor", workCompleted: "First-fix conduits in the procedure room. Dust barrier adjusted twice.", workPlanned: "Keep the ground floor clean for the morning clinic.", labour: [{ trade: "Electrician", count: 3 }, { trade: "Plumber", count: 2 }], materialsNote: "", delays: "", safety: "Patients used the side door.", defects: "Barrier gap at 8:10 am.", notes: "", status: "reviewed" }),
  report({ id: "rep_j1", projectId: "proj_jayanagar", authorId: "user_arjun", date: "2026-10-04", weather: "Clear", workCompleted: "Opened the niche panel and dried the patch.", workPlanned: "Run the shower test again after the new branch.", labour: [{ trade: "Plumber", count: 1 }, { trade: "Helper", count: 1 }], materialsNote: "Waiting on CPVC.", delays: "Part delivery only.", safety: "", defects: "Leak still open.", notes: "", status: "reviewed" }),
  report({ id: "rep_j2", projectId: "proj_jayanagar", authorId: "user_arjun", date: "2026-10-09", weather: "Clear", workCompleted: "Fitted six metres of CPVC. Shower test still fails at ten minutes.", workPlanned: "Open a larger panel on Monday.", labour: [{ trade: "Plumber", count: 1 }], materialsNote: "Six metres received.", delays: "", safety: "", defects: "Leak persists.", notes: "Handover stays blocked.", status: "submitted", photos: [{ id: "ph_j2", caption: "Damp patch after the shower test", localOnly: true }] }),
  report({ id: "rep_w1", projectId: "proj_warehouse", authorId: "user_sanjay", date: "2026-10-08", weather: "Hot, 31°C", workCompleted: "Cast three pedestals on grid C. Aggregate was on site.", workPlanned: "Cure and log cubes.", labour: [{ trade: "Mason", count: 5 }, { trade: "Helper", count: 7 }], materialsNote: "18 cum jelly received.", delays: "", safety: "New helmets issued.", defects: "Honeycomb at P12 noted.", notes: "", status: "submitted" }),
];

const attendanceDates = ["2026-10-05", "2026-10-06", "2026-10-07", "2026-10-08", "2026-10-09", "2026-10-10"];
const attendancePlan: Array<[string, string, AttendanceEntry["status"][]]> = [
  ["user_arjun", "proj_villa", ["present", "present", "present", "present", "present", "present"]],
  ["user_leela", "proj_lakeside", ["present", "present", "leave", "present", "present", "present"]],
  ["user_sanjay", "proj_koramangala", ["present", "present", "half_day", "present", "present", "absent"]],
  ["user_sanjay", "proj_warehouse", ["absent", "absent", "half_day", "absent", "absent", "present"]],
];

export const attendance: AttendanceEntry[] = attendancePlan.flatMap(([userId, projectId, statuses]) =>
  attendanceDates.map((date, index) => ({
    id: `att_${userId}_${projectId}_${date}`,
    companyId,
    projectId,
    userId,
    date,
    status: statuses[index] ?? "present",
    trade: userId === "user_sanjay" ? "Supervision" : "Site engineer",
  })),
);
