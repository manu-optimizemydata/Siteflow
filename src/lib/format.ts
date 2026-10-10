import type { Address } from "@/types/common";

const moneyFormatters = new Map<string, Intl.NumberFormat>();

export function formatMoney(value: number, currency = "INR", locale = "en-IN"): string {
  const key = `${locale}:${currency}`;
  let formatter = moneyFormatters.get(key);
  if (!formatter) {
    formatter = new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      maximumFractionDigits: value % 1 === 0 ? 0 : 2,
    });
    moneyFormatters.set(key, formatter);
  }
  return formatter.format(value);
}

export function formatCompactMoney(value: number, currency = "INR", locale = "en-IN"): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatNumber(value: number, locale = "en-IN"): string {
  return new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(value);
}

export function formatPercent(value: number): string {
  return `${Math.round(value)}%`;
}

export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  const local = digits.length > 10 ? digits.slice(-10) : digits;
  if (local.length !== 10) return phone;
  return `${local.slice(0, 5)} ${local.slice(5)}`;
}

export function formatAddress(address: Address): string {
  return [address.line1, address.area, address.city, address.state, address.postalCode].filter(Boolean).join(", ");
}

export function formatAddressShort(address: Address): string {
  return `${address.area}, ${address.city}`;
}

const LABEL_OVERRIDES: Record<string, string> = {
  new: "New",
  contacted: "Contacted",
  site_visit: "Site visit",
  estimation: "Estimation",
  quotation: "Quotation",
  negotiation: "Negotiation",
  won: "Won",
  lost: "Lost",
  referral: "Referral",
  website: "Website",
  architect: "Architect",
  repeat: "Repeat client",
  walk_in: "Walk-in",
  broker: "Broker",
  villa: "Villa",
  apartment: "Apartment",
  independent_house: "Independent house",
  office_fitout: "Office fit-out",
  commercial: "Commercial",
  industrial: "Industrial",
  residential: "Residential",
  individual: "Individual",
  organization: "Organisation",
  prospect: "Prospect",
  inactive: "Inactive",
  active: "Active",
  draft: "Draft",
  under_review: "Under review",
  approved: "Approved",
  archived: "Archived",
  in_review: "In review",
  sent: "Sent (simulated)",
  accepted: "Accepted",
  declined: "Declined",
  expired: "Expired",
  planning: "Planning",
  on_hold: "On hold",
  handover: "Handover",
  completed: "Completed",
  on_track: "On track",
  at_risk: "At risk",
  delayed: "Delayed",
  upcoming: "Upcoming",
  in_progress: "In progress",
  blocked: "Blocked",
  late: "Late",
  overdue: "Overdue",
  pending_approval: "Awaiting approval",
  ordered: "Ordered",
  partially_received: "Partially received",
  received: "Received",
  cancelled: "Cancelled",
  submitted: "Submitted",
  reviewed: "Reviewed",
  rejected: "Rejected",
  paid: "Paid",
  partial: "Partial",
  present: "Present",
  absent: "Absent",
  half_day: "Half day",
  leave: "Leave",
  owner: "Owner",
  project_manager: "Project manager",
  site_engineer: "Site engineer",
  accountant: "Accountant",
  materials: "Materials",
  labour: "Labour",
  subcontractors: "Subcontractors",
  equipment: "Equipment",
  overhead: "Overhead",
  other: "Other",
  low: "Low",
  medium: "Medium",
  high: "High",
  urgent: "Urgent",
  call: "Call",
  meeting: "Meeting",
  email: "Email",
  todo: "To do",
  done: "Done",
  open: "Open",
  resolved: "Resolved",
  quality: "Quality",
  schedule: "Schedule",
  procurement: "Procurement",
  safety: "Safety",
  client: "Client",
  admin: "Admin",
  defect: "Defect",
  delay: "Delay",
  none: "None",
  pending: "Pending",
  restricted: "Restricted",
  internal: "Internal",
  client_shared: "Shared with client",
  site_photos: "Site photos",
  meeting_notes: "Meeting notes",
  awaiting_review: "Awaiting review",
  bank_transfer: "Bank transfer",
  upi: "UPI",
  cheque: "Cheque",
  cash: "Cash",
  multi_site: "Many sites",
  growing: "Growing",
  boutique: "A few sites",
};

export function labelize(value: string): string {
  if (LABEL_OVERRIDES[value]) return LABEL_OVERRIDES[value];
  return value
    .split("_")
    .map((part) => (part ? part[0].toUpperCase() + part.slice(1) : part))
    .join(" ");
}

export function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
