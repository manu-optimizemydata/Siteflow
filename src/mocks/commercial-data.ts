import type { Estimate, Quotation } from "@/types/crm";
import type { BOQItem } from "@/types/crm";
import { companyId } from "@/mocks/helpers";

function item(id: string, description: string, category: string, unit: string, quantity: number, unitRate: number, taxRate = 18): BOQItem {
  return { id, description, category, unit, quantity, unitRate, taxRate };
}

function estimate(
  id: string,
  code: string,
  title: string,
  status: Estimate["status"],
  contingencyPercent: number,
  items: BOQItem[],
  links: { clientId?: string; leadId?: string; projectId?: string },
  updatedAt: string,
  versions: Estimate["versions"],
): Estimate {
  return { id, companyId, code, title, status, contingencyPercent, items, updatedAt, versions, ...links };
}

const villaItems = [
  item("bi_v1", "Excavation in ordinary soil", "materials", "cum", 220, 480, 18),
  item("bi_v2", "PCC 1:4:8", "materials", "cum", 55, 5200, 18),
  item("bi_v3", "RCC M25 including formwork", "materials", "cum", 220, 7800, 18),
  item("bi_v4", "TMT Fe500D reinforcement", "materials", "tonne", 42, 68500, 18),
  item("bi_v5", "9 inch brick masonry", "materials", "cum", 160, 6400, 18),
  item("bi_v6", "Internal plaster", "labour", "sqm", 2800, 285, 18),
  item("bi_v7", "Vitrified flooring", "materials", "sqft", 4800, 165, 18),
  item("bi_v8", "Waterproofing to toilets and terrace", "subcontractors", "sqm", 280, 480, 18),
  item("bi_v9", "Electrical and plumbing", "subcontractors", "nos", 1, 3200000, 18),
  item("bi_v10", "Joinery, kitchen, and wardrobes", "subcontractors", "nos", 1, 2400000, 18),
  item("bi_v11", "External development", "other", "nos", 1, 1800000, 18),
];

const hebbalV1 = [
  item("bi_h1", "Ground-floor extension RCC", "materials", "cum", 28, 7600, 18),
  item("bi_h2", "Brickwork", "materials", "cum", 32, 6200, 18),
  item("bi_h3", "Mangalore tile roof", "materials", "sqm", 86, 2400, 18),
];
const hebbalV2 = [
  ...hebbalV1,
  item("bi_h4", "Studio mezzanine in steel", "materials", "kg", 1800, 145, 18),
];

export const estimates: Estimate[] = [
  estimate("est_villa", "EST-WF-014", "Villa 14 BOQ", "approved", 4, villaItems, { clientId: "client_rao", leadId: "lead_villa", projectId: "proj_villa" }, "2026-03-18", [
    { version: 1, at: "2026-03-02", byId: "user_divya", note: "First quantity takeoff from architect drawings. Not generated from a model.", items: villaItems.slice(0, 6), contingencyPercent: 5 },
    { version: 2, at: "2026-03-18", byId: "user_divya", note: "Added flooring and waterproofing after the client walkthrough.", items: villaItems, contingencyPercent: 4 },
  ]),
  estimate("est_hebbal", "EST-HB-021", "Hebbal extension BOQ", "under_review", 5, hebbalV2, { clientId: "client_menon", leadId: "lead_hebbal" }, "2026-10-04", [
    { version: 1, at: "2026-09-22", byId: "user_divya", note: "Without the studio.", items: hebbalV1, contingencyPercent: 5 },
    { version: 2, at: "2026-10-04", byId: "user_divya", note: "Studio mezzanine added. Awaiting Kavya’s review.", items: hebbalV2, contingencyPercent: 5 },
  ]),
  estimate("est_lakeside", "EST-LS-202", "Tower B structural package", "approved", 3, [
    item("bi_l1", "Raft concrete M30", "materials", "cum", 840, 8200, 18),
    item("bi_l2", "Typical-floor slab concrete", "materials", "cum", 2100, 7900, 18),
    item("bi_l3", "Reinforcement Fe500D", "materials", "tonne", 620, 69000, 18),
    item("bi_l4", "Aluminium formwork hire", "equipment", "sqm", 18000, 95, 18),
    item("bi_l5", "Blockwork to flats", "materials", "sqm", 42000, 820, 18),
  ], { clientId: "client_lakeside", projectId: "proj_lakeside" }, "2025-12-12", [
    { version: 1, at: "2025-12-12", byId: "user_divya", note: "Developer BOQ, civil package only.", items: [], contingencyPercent: 3 },
  ]),
  estimate("est_koramangala", "EST-KR-088", "Northstar fit-out BOQ", "approved", 5, [
    item("bi_k1", "Gypsum partitions", "materials", "sqm", 980, 1450, 18),
    item("bi_k2", "Mineral-fibre ceiling", "materials", "sqm", 1100, 860, 18),
    item("bi_k3", "HVAC low side", "subcontractors", "sqft", 12000, 240, 18),
    item("bi_k4", "Electrical wiring and points", "subcontractors", "nos", 640, 1850, 18),
    item("bi_k5", "Carpet tile", "materials", "sqm", 860, 2100, 18),
  ], { clientId: "client_northstar", projectId: "proj_koramangala" }, "2026-06-20", [
    { version: 1, at: "2026-06-20", byId: "user_divya", note: "Issued for construction.", items: [], contingencyPercent: 5 },
  ]),
  estimate("est_townhouse", "EST-IN-031", "Indiranagar townhouse BOQ", "approved", 4, [
    item("bi_t1", "Structural concrete", "materials", "cum", 64, 7700, 18),
    item("bi_t2", "AAC masonry", "materials", "cum", 48, 6900, 18),
    item("bi_t3", "Kota and vitrified flooring", "materials", "sqft", 2100, 190, 18),
    item("bi_t4", "Carpentry and shutters", "subcontractors", "sqft", 640, 980, 18),
  ], { clientId: "client_iyer", leadId: "lead_townhouse", projectId: "proj_townhouse" }, "2026-05-02", [
    { version: 1, at: "2026-05-02", byId: "user_divya", note: "Accepted with the staircase revision.", items: [], contingencyPercent: 4 },
  ]),
  estimate("est_clinic", "EST-HS-017", "HSR clinic BOQ", "approved", 5, [
    item("bi_c1", "Medical-gas piping", "subcontractors", "rmt", 180, 2400, 18),
    item("bi_c2", "Washable vinyl flooring", "materials", "sqm", 420, 1650, 18),
    item("bi_c3", "Gypsum and moisture board", "materials", "sqm", 610, 1280, 18),
    item("bi_c4", "Electrical and UPS points", "subcontractors", "nos", 220, 2400, 18),
  ], { clientId: "client_sagar", leadId: "lead_clinic", projectId: "proj_clinic" }, "2026-05-28", [
    { version: 1, at: "2026-05-28", byId: "user_divya", note: "Clinical planner quantities. Not a drawing takeoff by SiteFlow.", items: [], contingencyPercent: 5 },
  ]),
  estimate("est_school", "EST-MY-014", "Mysuru classroom block, draft", "draft", 6, [
    item("bi_s1", "RCC framed structure", "materials", "sqft", 18000, 1850, 18),
    item("bi_s2", "Kota flooring to corridors", "materials", "sqft", 6000, 140, 18),
    item("bi_s3", "Classroom finishes", "labour", "sqft", 12000, 420, 18),
  ], { clientId: "client_greenfield", leadId: "lead_school" }, "2026-09-28", [
    { version: 1, at: "2026-09-28", byId: "user_divya", note: "Area-rate draft for negotiation. Not a measured BOQ.", items: [], contingencyPercent: 6 },
  ]),
  estimate("est_jayanagar", "EST-JN-006", "Jayanagar duplex BOQ", "approved", 3, [
    item("bi_j1", "RCC and masonry", "materials", "sqft", 2400, 1650, 18),
    item("bi_j2", "Flooring and painting", "materials", "sqft", 2400, 280, 18),
    item("bi_j3", "Services", "subcontractors", "nos", 1, 900000, 18),
  ], { clientId: "client_malhotra", leadId: "lead_jayanagar", projectId: "proj_jayanagar" }, "2025-10-18", [
    { version: 1, at: "2025-10-18", byId: "user_divya", note: "Accepted package.", items: [], contingencyPercent: 3 },
  ]),
  estimate("est_warehouse", "EST-EC-054", "Warehouse civil package", "approved", 4, [
    item("bi_w1", "Excavation and backfill", "materials", "cum", 2400, 420, 18),
    item("bi_w2", "Isolated footings M25", "materials", "cum", 380, 7600, 18),
    item("bi_w3", "Floor slab M25", "materials", "cum", 520, 7400, 18),
    item("bi_w4", "Office block structure", "materials", "sqft", 6000, 1550, 18),
  ], { clientId: "client_helios", leadId: "lead_warehouse", projectId: "proj_warehouse" }, "2026-07-12", [
    { version: 1, at: "2026-07-12", byId: "user_divya", note: "Civil package. PEB supply is outside this BOQ.", items: [], contingencyPercent: 4 },
  ]),
  estimate("est_lost", "EST-HS-004", "HSR duplex, declined", "archived", 5, [
    item("bi_x1", "Rebuild structure", "materials", "sqft", 1800, 1700, 18),
    item("bi_x2", "Finishes", "labour", "sqft", 1800, 350, 18),
  ], { leadId: "lead_hsr_lost" }, "2026-08-08", [
    { version: 1, at: "2026-08-08", byId: "user_divya", note: "Archived after the lead was lost.", items: [], contingencyPercent: 5 },
  ]),
  estimate("est_mg", "EST-MG-011", "MG Road boutique office, draft", "draft", 5, [
    item("bi_m1", "Meeting-room joinery", "subcontractors", "sqft", 420, 2200, 18),
    item("bi_m2", "Acoustic ceiling", "materials", "sqm", 180, 1450, 18),
    item("bi_m3", "Electrical points", "subcontractors", "nos", 80, 1650, 18),
  ], { leadId: "lead_mg" }, "2026-10-07", [
    { version: 1, at: "2026-10-07", byId: "user_divya", note: "Draft from the site visit. Not from a measured drawing set.", items: [], contingencyPercent: 5 },
  ]),
  estimate("est_retail", "EST-KA-009", "Kaveri retail shell", "approved", 4, [
    item("bi_r1", "Structural glazing", "subcontractors", "sqm", 220, 6800, 18),
    item("bi_r2", "Entrance lobby stone", "materials", "sqft", 1400, 320, 18),
    item("bi_r3", "Staircase and handrail", "materials", "nos", 2, 280000, 18),
    item("bi_r4", "External paint", "labour", "sqm", 900, 180, 18),
  ], { clientId: "client_kaveri", leadId: "lead_retail" }, "2026-09-26", [
    { version: 1, at: "2026-09-26", byId: "user_divya", note: "Used for the quotation marked sent.", items: [], contingencyPercent: 4 },
  ]),
];

estimates.forEach((estimateRecord) => {
  const current = estimateRecord.versions[estimateRecord.versions.length - 1];
  if (current && current.items.length === 0) current.items = estimateRecord.items;
});

function quote(
  id: string,
  code: string,
  title: string,
  status: Quotation["status"],
  estimateId: string,
  clientId: string,
  validityDate: string,
  createdAt: string,
  extra: Partial<Quotation> = {},
): Quotation {
  return {
    id,
    companyId,
    code,
    title,
    clientId,
    estimateId,
    version: 1,
    status,
    validityDate,
    discountAmount: 0,
    adjustmentLabel: "",
    adjustmentAmount: 0,
    notes: "",
    createdAt,
    ...extra,
  };
}

export const quotations: Quotation[] = [
  quote("quo_villa", "QT-WF-014", "Villa 14 quotation", "accepted", "est_villa", "client_rao", "2026-04-15", "2026-03-20", { leadId: "lead_villa", projectId: "proj_villa", issueDate: "2026-03-20", discountAmount: 150000, notes: "Accepted with the pool as a later variation." }),
  quote("quo_hebbal", "QT-HB-021", "Hebbal extension quotation", "in_review", "est_hebbal", "client_menon", "2026-11-15", "2026-10-05", { leadId: "lead_hebbal", version: 2, notes: "Internal review. Nothing has been sent." }),
  quote("quo_lakeside", "QT-LS-202", "Tower B civil quotation", "accepted", "est_lakeside", "client_lakeside", "2026-01-31", "2025-12-20", { projectId: "proj_lakeside", issueDate: "2025-12-20", adjustmentLabel: "Mobilisation adjustment", adjustmentAmount: -250000 }),
  quote("quo_koramangala", "QT-KR-088", "Northstar fit-out quotation", "accepted", "est_koramangala", "client_northstar", "2026-07-15", "2026-06-22", { projectId: "proj_koramangala", issueDate: "2026-06-22" }),
  quote("quo_townhouse", "QT-IN-031", "Townhouse quotation", "accepted", "est_townhouse", "client_iyer", "2026-05-30", "2026-05-06", { leadId: "lead_townhouse", projectId: "proj_townhouse", issueDate: "2026-05-06", discountAmount: 80000 }),
  quote("quo_clinic", "QT-HS-017", "Clinic fit-out quotation", "accepted", "est_clinic", "client_sagar", "2026-06-20", "2026-05-30", { leadId: "lead_clinic", projectId: "proj_clinic", issueDate: "2026-05-30" }),
  quote("quo_school", "QT-MY-014", "Classroom block quotation", "draft", "est_school", "client_greenfield", "2026-11-30", "2026-10-02", { leadId: "lead_school", notes: "Draft for the negotiation meeting. Not sent." }),
  quote("quo_retail", "QT-KA-009", "Retail shell quotation", "sent", "est_retail", "client_kaveri", "2026-10-27", "2026-09-29", { leadId: "lead_retail", issueDate: "2026-09-29", discountAmount: 120000, notes: "Marked sent inside this demo. No email was delivered." }),
  quote("quo_jayanagar", "QT-JN-006", "Jayanagar duplex quotation", "accepted", "est_jayanagar", "client_malhotra", "2025-12-01", "2025-10-20", { leadId: "lead_jayanagar", projectId: "proj_jayanagar", issueDate: "2025-10-20" }),
  quote("quo_warehouse", "QT-EC-054", "Warehouse civil quotation", "accepted", "est_warehouse", "client_helios", "2026-08-01", "2026-07-18", { leadId: "lead_warehouse", projectId: "proj_warehouse", issueDate: "2026-07-18", notes: "Civil package only. The PEB frame is client-supplied." }),
  quote("quo_declined", "QT-HS-004", "Earlier HSR duplex quotation", "declined", "est_lost", "client_malhotra", "2026-08-30", "2026-08-10", { leadId: "lead_hsr_lost", issueDate: "2026-08-10", notes: "Client chose another contractor on programme." }),
  quote("quo_expired", "QT-MG-002", "MG Road advisory fit-out, previous", "expired", "est_koramangala", "client_northstar", "2026-09-01", "2026-08-01", { issueDate: "2026-08-01", notes: "Validity lapsed. A fresh estimate is in progress on the lead." }),
];
