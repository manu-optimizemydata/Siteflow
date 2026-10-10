import type { Client, FollowUp, Lead, SiteVisit } from "@/types/crm";
import type { Company, User, WorkspaceSettings } from "@/types/company";
import { addr, companyId } from "@/mocks/helpers";

export const company: Company = {
  id: companyId,
  name: "Aarohan Buildworks",
  legalName: "Aarohan Buildworks Pvt. Ltd.",
  city: "Bengaluru",
  state: "Karnataka",
  phone: "8045672210",
  email: "studio@aarohan-buildworks.example",
  sampleTaxId: "29AAAAA0000A1Z5",
};

export const settings: WorkspaceSettings = {
  companyName: "Aarohan Buildworks",
  businessType: "both",
  region: "IN-KA",
  currency: "INR",
  locale: "en-IN",
  timezone: "Asia/Kolkata",
  projectScale: "growing",
  leadStages: [
    { id: "new", label: "New", order: 1 },
    { id: "contacted", label: "Contacted", order: 2 },
    { id: "site_visit", label: "Site visit", order: 3 },
    { id: "estimation", label: "Estimation", order: 4 },
    { id: "quotation", label: "Quotation", order: 5 },
    { id: "negotiation", label: "Negotiation", order: 6 },
    { id: "won", label: "Won", order: 7 },
    { id: "lost", label: "Lost", order: 8 },
  ],
  projectTypes: [
    { id: "villa", label: "Villa" },
    { id: "apartment", label: "Apartment" },
    { id: "independent_house", label: "Independent house" },
    { id: "office_fitout", label: "Office fit-out" },
    { id: "commercial", label: "Commercial" },
    { id: "industrial", label: "Industrial" },
  ],
  costCategories: [
    { id: "materials", label: "Materials" },
    { id: "labour", label: "Labour" },
    { id: "subcontractors", label: "Subcontractors" },
    { id: "equipment", label: "Equipment" },
    { id: "overhead", label: "Overhead" },
    { id: "other", label: "Other" },
  ],
  units: ["nos", "sqm", "sqft", "cum", "kg", "tonne", "metre", "day", "bag", "rmt"],
  taxLabel: "GST",
  notificationPreferences: { siteReports: true, approvals: true, overdue: true, digest: false },
};

export const users: User[] = [
  { id: "user_meera", companyId, name: "Meera Kapoor", role: "owner", jobTitle: "Managing director", phone: "9845011220", email: "meera.kapoor@aarohan-buildworks.example", status: "active", projectIds: [], avatarHue: 152 },
  { id: "user_kavya", companyId, name: "Kavya Nair", role: "project_manager", jobTitle: "Project manager", phone: "9845122301", email: "kavya.nair@aarohan-buildworks.example", status: "active", projectIds: ["proj_villa", "proj_lakeside", "proj_jayanagar"], avatarHue: 168 },
  { id: "user_nisha", companyId, name: "Nisha Reddy", role: "project_manager", jobTitle: "Project manager", phone: "9845233412", email: "nisha.reddy@aarohan-buildworks.example", status: "active", projectIds: ["proj_koramangala", "proj_townhouse", "proj_clinic", "proj_warehouse"], avatarHue: 28 },
  { id: "user_arjun", companyId, name: "Arjun Deshmukh", role: "site_engineer", jobTitle: "Site engineer", phone: "9845344523", email: "arjun.deshmukh@aarohan-buildworks.example", status: "active", projectIds: ["proj_villa", "proj_townhouse", "proj_jayanagar"], avatarHue: 200 },
  { id: "user_leela", companyId, name: "Leela Krishnan", role: "site_engineer", jobTitle: "Site engineer", phone: "9845455634", email: "leela.krishnan@aarohan-buildworks.example", status: "active", projectIds: ["proj_lakeside", "proj_clinic"], avatarHue: 262 },
  { id: "user_sanjay", companyId, name: "Sanjay Rao", role: "site_engineer", jobTitle: "Site supervisor", phone: "9845566745", email: "sanjay.rao@aarohan-buildworks.example", trade: "Supervision", status: "active", projectIds: ["proj_koramangala", "proj_warehouse"], avatarHue: 12 },
  { id: "user_rohan", companyId, name: "Rohan Iyer", role: "accountant", jobTitle: "Accountant", phone: "9845677856", email: "rohan.iyer@aarohan-buildworks.example", status: "active", projectIds: [], avatarHue: 42 },
  { id: "user_divya", companyId, name: "Divya Shetty", role: "project_manager", jobTitle: "Estimator", phone: "9845788967", email: "divya.shetty@aarohan-buildworks.example", status: "active", projectIds: [], avatarHue: 320 },
  { id: "user_imran", companyId, name: "Imran Qureshi", role: "project_manager", jobTitle: "Procurement lead", phone: "9845899078", email: "imran.qureshi@aarohan-buildworks.example", status: "active", projectIds: [], avatarHue: 188 },
];

export const clients: Client[] = [
  { id: "client_rao", companyId, name: "Aditi & Vikram Rao", kind: "individual", type: "residential", status: "active", phone: "9845011001", email: "rao.household@example.com", location: addr("Plot 14, Palm Meadows", "Whitefield", "560066"), contacts: [{ id: "cp_rao", name: "Vikram Rao", role: "Owner", phone: "9845011001", email: "vikram.rao@example.com" }], notes: "Weekend site visits only. Prefer updates on Saturday evening." },
  { id: "client_lakeside", companyId, name: "Lakeside Habitat Pvt. Ltd.", kind: "organization", type: "residential", status: "active", phone: "8041208800", email: "projects@lakeside-habitat.example", location: addr("4th floor, Habitat House", "Hebbal", "560024"), contacts: [{ id: "cp_lake", name: "Sneha Kulkarni", role: "Development manager", phone: "9845022002", email: "sneha.kulkarni@lakeside-habitat.example" }], notes: "Phase 2 of a three-tower residential development." },
  { id: "client_northstar", companyId, name: "Northstar Offices LLP", kind: "organization", type: "commercial", status: "active", phone: "8044550190", email: "workplace@northstar-offices.example", location: addr("12, 80 Feet Road", "Koramangala", "560034"), contacts: [{ id: "cp_ns", name: "Harish Menon", role: "Workplace lead", phone: "9845033003", email: "harish.menon@northstar-offices.example" }], notes: "Occupied floor. Noisy work only after 7 pm and on Sundays." },
  { id: "client_iyer", companyId, name: "Iyer Family Trust", kind: "organization", type: "residential", status: "active", phone: "9845044004", email: "trust@iyer-family.example", location: addr("18, 12th Main", "Indiranagar", "560038"), contacts: [{ id: "cp_iyer", name: "Lakshmi Iyer", role: "Trustee", phone: "9845044004", email: "lakshmi.iyer@example.com" }], notes: "Heritage-adjacent street. Watch setbacks and neighbour access." },
  { id: "client_sagar", companyId, name: "Sagar Clinics", kind: "organization", type: "commercial", status: "active", phone: "8048902211", email: "admin@sagar-clinics.example", location: addr("27th Main, Sector 2", "HSR Layout", "560102"), contacts: [{ id: "cp_sagar", name: "Dr. Anil Sagar", role: "Director", phone: "9845055005", email: "anil.sagar@sagar-clinics.example" }], notes: "Clinic must stay open on the ground floor during fit-out." },
  { id: "client_malhotra", companyId, name: "Malhotra Residences", kind: "individual", type: "residential", status: "active", phone: "9845066006", email: "malhotra.home@example.com", location: addr("41, 4th Block", "Jayanagar", "560041"), contacts: [{ id: "cp_mal", name: "Ritu Malhotra", role: "Owner", phone: "9845066006", email: "ritu.malhotra@example.com" }], notes: "Moving in after snag clearance. Final invoice still open." },
  { id: "client_helios", companyId, name: "Helios Logistics", kind: "organization", type: "commercial", status: "active", phone: "8045679001", email: "infra@helios-logistics.example", location: addr("Plot 54, Industrial Area", "Electronic City", "560100"), contacts: [{ id: "cp_hel", name: "Farhan Syed", role: "Facilities head", phone: "9845077007", email: "farhan.syed@helios-logistics.example" }], notes: "Pre-engineered warehouse with a small office block." },
  { id: "client_menon", companyId, name: "Priya Menon", kind: "individual", type: "residential", status: "prospect", phone: "9845088008", email: "priya.menon@example.com", location: addr("Survey 88", "Hebbal", "560024"), contacts: [{ id: "cp_menon", name: "Priya Menon", role: "Owner", phone: "9845088008", email: "priya.menon@example.com" }], notes: "Comparing two contractors for a farmhouse extension." },
  { id: "client_greenfield", companyId, name: "Greenfield Schools", kind: "organization", type: "commercial", status: "prospect", phone: "8214091122", email: "projects@greenfield-schools.example", location: addr("Campus road", "VV Mohalla", "570002", "Mysuru"), contacts: [{ id: "cp_gf", name: "Revathi Rao", role: "Admin head", phone: "9845099009", email: "revathi.rao@greenfield-schools.example" }], notes: "Classroom block must be ready before the June term." },
  { id: "client_kaveri", companyId, name: "Kaveri Retail Spaces", kind: "organization", type: "commercial", status: "prospect", phone: "8041226677", email: "leases@kaveri-retail.example", location: addr("100 Feet Road", "Indiranagar", "560038"), contacts: [{ id: "cp_kav", name: "Nikhil Bansal", role: "Leasing", phone: "9845101010", email: "nikhil.bansal@kaveri-retail.example" }], notes: "Three-store retail shell. Quotation sent, awaiting comments." },
];

export const leads: Lead[] = [
  { id: "lead_hebbal", companyId, title: "Hebbal farmhouse extension", contactName: "Priya Menon", organization: "Menon family", clientId: "client_menon", phone: "9845088008", email: "priya.menon@example.com", source: "referral", projectType: "independent_house", location: addr("Survey 88, off Ballari Road", "Hebbal", "560024"), estimatedValue: 5400000, stage: "quotation", ownerId: "user_divya", nextFollowUp: "2026-10-13", lastContact: "2026-10-06", notes: "Wants a 2,400 sqft extension with a separate studio. Sensitive to neighbour setbacks.", createdAt: "2026-09-02" },
  { id: "lead_sarjapur", companyId, title: "Sarjapur road duplex", contactName: "Neha Kulkarni", organization: "", phone: "9845112211", email: "neha.kulkarni@example.com", source: "website", projectType: "villa", location: addr("Plot 9, Rain Tree Layout", "Sarjapur Road", "560035"), estimatedValue: 16800000, stage: "new", ownerId: "user_divya", nextFollowUp: "2026-10-11", notes: "Enquiry form asked for a 4-bedroom duplex and a small pool.", createdAt: "2026-10-08" },
  { id: "lead_villa", companyId, title: "Whitefield villa 14", contactName: "Vikram Rao", organization: "Rao household", clientId: "client_rao", phone: "9845011001", email: "vikram.rao@example.com", source: "architect", projectType: "villa", location: addr("Plot 14, Palm Meadows", "Whitefield", "560066"), estimatedValue: 18500000, stage: "won", ownerId: "user_divya", lastContact: "2026-04-02", notes: "Converted after the March quotation. Architect is Studio Lane.", createdAt: "2026-02-11", convertedProjectId: "proj_villa" },
  { id: "lead_jp", companyId, title: "JP Nagar independent house", contactName: "Arvind Bhat", organization: "", phone: "9845123322", email: "arvind.bhat@example.com", source: "walk_in", projectType: "independent_house", location: addr("22, 15th Cross", "JP Nagar", "560078"), estimatedValue: 9200000, stage: "contacted", ownerId: "user_kavya", nextFollowUp: "2026-10-12", lastContact: "2026-10-04", notes: "First call done. Budget is firm. Wants a site visit next week.", createdAt: "2026-09-28" },
  { id: "lead_yelahanka", companyId, title: "Yelahanka plot development", contactName: "Fatima Khan", organization: "Khan family", phone: "9845134433", email: "fatima.khan@example.com", source: "broker", projectType: "villa", location: addr("Site 4, Attur Layout", "Yelahanka", "560064"), estimatedValue: 21000000, stage: "site_visit", ownerId: "user_divya", nextFollowUp: "2026-10-15", lastContact: "2026-10-03", notes: "Soil looks filled. Ask for a soil test before estimation.", createdAt: "2026-09-18" },
  { id: "lead_mg", companyId, title: "MG Road boutique office", contactName: "Rahul Deshpande", organization: "Deshpande Advisory", phone: "9845145544", email: "rahul.deshpande@example.com", source: "repeat", projectType: "office_fitout", location: addr("3rd floor, Barton Centre", "MG Road", "560001"), estimatedValue: 7600000, stage: "estimation", ownerId: "user_divya", nextFollowUp: "2026-10-14", lastContact: "2026-10-07", notes: "Repeat client from a 2024 fit-out. Wants a quieter meeting room.", createdAt: "2026-09-09" },
  { id: "lead_hsr_lost", companyId, title: "HSR duplex rebuild", contactName: "Sanjana Pai", organization: "", phone: "9845156655", email: "sanjana.pai@example.com", source: "website", projectType: "independent_house", location: addr("512, 27th Main", "HSR Layout", "560102"), estimatedValue: 6400000, stage: "lost", ownerId: "user_kavya", lastContact: "2026-08-22", notes: "Lost on timeline. They appointed a contractor who could start in August.", createdAt: "2026-07-30" },
  { id: "lead_townhouse", companyId, title: "Indiranagar townhouse", contactName: "Lakshmi Iyer", organization: "Iyer Family Trust", clientId: "client_iyer", phone: "9845044004", email: "lakshmi.iyer@example.com", source: "referral", projectType: "independent_house", location: addr("18, 12th Main", "Indiranagar", "560038"), estimatedValue: 9600000, stage: "won", ownerId: "user_divya", lastContact: "2026-05-12", notes: "Won after two revisions on the staircase and courtyard.", createdAt: "2026-04-02", convertedProjectId: "proj_townhouse" },
  { id: "lead_school", companyId, title: "Mysuru classroom block", contactName: "Revathi Rao", organization: "Greenfield Schools", clientId: "client_greenfield", phone: "9845099009", email: "revathi.rao@greenfield-schools.example", source: "architect", projectType: "commercial", location: addr("Campus road", "VV Mohalla", "570002", "Mysuru"), estimatedValue: 28000000, stage: "negotiation", ownerId: "user_kavya", nextFollowUp: "2026-10-16", lastContact: "2026-10-01", notes: "Board wants a June 2027 handover. Price is close; retention terms are open.", createdAt: "2026-08-14" },
  { id: "lead_retail", companyId, title: "Indiranagar retail shell", contactName: "Nikhil Bansal", organization: "Kaveri Retail Spaces", clientId: "client_kaveri", phone: "9845101010", email: "nikhil.bansal@kaveri-retail.example", source: "broker", projectType: "commercial", location: addr("100 Feet Road", "Indiranagar", "560038"), estimatedValue: 13200000, stage: "quotation", ownerId: "user_divya", nextFollowUp: "2026-10-09", lastContact: "2026-09-29", notes: "Follow-up is overdue. Quotation was marked sent in the demo on 29 Sep.", createdAt: "2026-09-05" },
  { id: "lead_jayanagar", companyId, title: "Jayanagar duplex", contactName: "Ritu Malhotra", organization: "Malhotra Residences", clientId: "client_malhotra", phone: "9845066006", email: "ritu.malhotra@example.com", source: "repeat", projectType: "independent_house", location: addr("41, 4th Block", "Jayanagar", "560041"), estimatedValue: 7200000, stage: "won", ownerId: "user_divya", lastContact: "2025-11-02", notes: "Second project for the family. Now in handover.", createdAt: "2025-10-12", convertedProjectId: "proj_jayanagar" },
  { id: "lead_clinic", companyId, title: "HSR clinic fit-out", contactName: "Dr. Anil Sagar", organization: "Sagar Clinics", clientId: "client_sagar", phone: "9845055005", email: "anil.sagar@sagar-clinics.example", source: "referral", projectType: "commercial", location: addr("27th Main, Sector 2", "HSR Layout", "560102"), estimatedValue: 11500000, stage: "won", ownerId: "user_nisha", lastContact: "2026-06-01", notes: "Clinical planning by an external MEP consultant.", createdAt: "2026-05-04", convertedProjectId: "proj_clinic" },
  { id: "lead_warehouse", companyId, title: "Electronic City warehouse", contactName: "Farhan Syed", organization: "Helios Logistics", clientId: "client_helios", phone: "9845077007", email: "farhan.syed@helios-logistics.example", source: "website", projectType: "industrial", location: addr("Plot 54, Industrial Area", "Electronic City", "560100"), estimatedValue: 32000000, stage: "won", ownerId: "user_kavya", lastContact: "2026-07-20", notes: "Letter of intent signed. PEB supplier is separate from civil scope.", createdAt: "2026-06-18", convertedProjectId: "proj_warehouse" },
];

export const followUps: FollowUp[] = [
  { id: "fu_1", companyId, leadId: "lead_hebbal", date: "2026-10-06", type: "call", notes: "Walked Priya through version 2. She will confirm the studio roof.", ownerId: "user_divya", completed: true },
  { id: "fu_2", companyId, leadId: "lead_hebbal", date: "2026-10-13", type: "call", notes: "Confirm whether the studio stays in scope.", ownerId: "user_divya", completed: false },
  { id: "fu_3", companyId, leadId: "lead_sarjapur", date: "2026-10-11", type: "call", notes: "Introduce Kavya and ask for the plot sketch.", ownerId: "user_divya", completed: false },
  { id: "fu_4", companyId, leadId: "lead_jp", date: "2026-10-04", type: "call", notes: "Discussed a November start. He wants a Saturday visit.", ownerId: "user_kavya", completed: true },
  { id: "fu_5", companyId, leadId: "lead_jp", date: "2026-10-12", type: "site_visit", notes: "Visit 22, 15th Cross with Arjun.", ownerId: "user_kavya", completed: false },
  { id: "fu_6", companyId, leadId: "lead_yelahanka", date: "2026-10-03", type: "site_visit", notes: "Filled soil along the north boundary. Photos in the lead file.", ownerId: "user_divya", completed: true },
  { id: "fu_7", companyId, leadId: "lead_school", date: "2026-10-16", type: "meeting", notes: "Commercial terms with the school board.", ownerId: "user_kavya", completed: false },
  { id: "fu_8", companyId, leadId: "lead_retail", date: "2026-10-09", type: "email", notes: "Chase comments on the sent quotation. Overdue.", ownerId: "user_divya", completed: false },
  { id: "fu_9", companyId, leadId: "lead_mg", date: "2026-10-14", type: "meeting", notes: "Review the draft BOQ with Rahul.", ownerId: "user_divya", completed: false },
];

export const siteVisits: SiteVisit[] = [
  { id: "sv_1", companyId, leadId: "lead_yelahanka", date: "2026-10-03", location: "Site 4, Attur Layout", notes: "Access road is narrow for a transit mixer. North fill needs a soil report.", ownerId: "user_divya" },
  { id: "sv_2", companyId, leadId: "lead_hebbal", date: "2026-09-12", location: "Survey 88, Hebbal", notes: "Existing plinth is sound. Extension can tie into the west wall.", ownerId: "user_arjun" },
  { id: "sv_3", companyId, leadId: "lead_mg", date: "2026-09-20", location: "Barton Centre, MG Road", notes: "Lift lobby cannot be used for material. Service stair only after 8 pm.", ownerId: "user_nisha" },
  { id: "sv_4", companyId, leadId: "lead_school", date: "2026-09-02", location: "Greenfield campus, Mysuru", notes: "Work area is beside the primary block. Safety fencing is mandatory.", ownerId: "user_kavya" },
];
