import type { PermissionKey, UserRole } from "@/types/common";

export interface NavItem {
  href: string;
  label: string;
  description: string;
  roles: UserRole[];
  mobile?: boolean;
}

export interface NavGroup {
  id: string;
  label: string;
  items: NavItem[];
}

const allRoles: UserRole[] = ["owner", "project_manager", "site_engineer", "accountant"];

export const navGroups: NavGroup[] = [
  {
    id: "overview",
    label: "Overview",
    items: [
      { href: "/pulse", label: "Pulse", description: "Portfolio health and decisions", roles: allRoles, mobile: true },
      { href: "/site", label: "My site", description: "Today on site", roles: ["site_engineer", "project_manager"], mobile: true },
      { href: "/activity", label: "Activity", description: "What changed in the business", roles: allRoles },
    ],
  },
  {
    id: "business",
    label: "Business",
    items: [
      { href: "/crm/leads", label: "Leads", description: "Enquiries and follow-ups", roles: ["owner", "project_manager"], mobile: true },
      { href: "/crm/clients", label: "Clients", description: "People and organisations", roles: ["owner", "project_manager", "accountant"] },
      { href: "/crm/estimates", label: "Estimates", description: "Quantities, rates, and revisions", roles: ["owner", "project_manager"] },
      { href: "/crm/quotations", label: "Quotations", description: "Versions and simulated sending", roles: ["owner", "project_manager"] },
    ],
  },
  {
    id: "projects",
    label: "Projects",
    items: [
      { href: "/projects", label: "Project portfolio", description: "Delivery across sites", roles: allRoles, mobile: true },
      { href: "/projects/schedule", label: "Schedule", description: "Dates, dependencies, and slippage", roles: ["owner", "project_manager", "site_engineer"] },
      { href: "/operations/site-reports", label: "Site reports", description: "Progress and site conditions", roles: ["owner", "project_manager", "site_engineer"], mobile: true },
      { href: "/operations/tasks", label: "Tasks and issues", description: "Work, blockers, and defects", roles: allRoles, mobile: true },
      { href: "/projects/handover", label: "Handover", description: "Closeout checklist", roles: ["owner", "project_manager"] },
    ],
  },
  {
    id: "operations",
    label: "Operations",
    items: [
      { href: "/operations/materials", label: "Materials", description: "Simulated stock and reorder points", roles: ["owner", "project_manager", "site_engineer"] },
      { href: "/operations/requests", label: "Material requests", description: "Need-by dates and approvals", roles: ["owner", "project_manager", "site_engineer"], mobile: true },
      { href: "/operations/purchase-orders", label: "Purchase orders", description: "Commitments, not payments", roles: ["owner", "project_manager", "accountant"] },
      { href: "/operations/suppliers", label: "Suppliers", description: "Material suppliers", roles: ["owner", "project_manager", "accountant"] },
      { href: "/operations/subcontractors", label: "Subcontractors", description: "Work, contracts, and bills", roles: ["owner", "project_manager", "accountant"] },
    ],
  },
  {
    id: "finance",
    label: "Finance",
    items: [
      { href: "/finance", label: "Finance overview", description: "Receivables, cost, and commitments", roles: ["owner", "accountant"], mobile: true },
      { href: "/finance/job-costing", label: "Budget and cost", description: "Budget, actual, and committed", roles: ["owner", "project_manager", "accountant"] },
      { href: "/finance/expenses", label: "Expenses", description: "Costs posted to a project", roles: ["owner", "accountant"], mobile: true },
      { href: "/finance/invoices", label: "Invoices", description: "Billing, collection, and overdue", roles: ["owner", "accountant"], mobile: true },
      { href: "/finance/vendor-bills", label: "Vendor bills", description: "Supplier and subcontractor bills", roles: ["owner", "accountant"], mobile: true },
      { href: "/reports", label: "Reports", description: "Tables you can export on this device", roles: ["owner", "project_manager", "accountant"] },
    ],
  },
  {
    id: "workspace",
    label: "Workspace",
    items: [
      { href: "/documents", label: "Documents", description: "Local demo files and versions", roles: allRoles },
      { href: "/team", label: "Team", description: "People on the job, not payroll", roles: allRoles },
      { href: "/notifications", label: "Notifications", description: "Read and unread", roles: allRoles },
      { href: "/settings", label: "Settings", description: "Workspace preferences and demo reset", roles: allRoles },
      { href: "/modules", label: "All modules", description: "Every screen in this demo", roles: allRoles },
    ],
  },
];

export function navigationForRole(role: UserRole): NavGroup[] {
  return navGroups
    .map((group) => ({ ...group, items: group.items.filter((item) => item.roles.includes(role)) }))
    .filter((group) => group.items.length > 0);
}

export function mobileNavForRole(role: UserRole): NavItem[] {
  const preferred: Record<UserRole, string[]> = {
    owner: ["/pulse", "/projects", "/crm/leads", "/finance"],
    project_manager: ["/projects", "/operations/tasks", "/operations/site-reports", "/operations/purchase-orders"],
    site_engineer: ["/site", "/operations/site-reports", "/operations/tasks", "/operations/requests"],
    accountant: ["/finance", "/finance/invoices", "/finance/expenses", "/finance/vendor-bills"],
  };
  const flat = navigationForRole(role).flatMap((group) => group.items);
  return preferred[role].map((href) => flat.find((item) => item.href === href)).filter((item): item is NavItem => Boolean(item));
}

export function homeForRole(role: UserRole): string {
  switch (role) {
    case "owner":
      return "/pulse";
    case "site_engineer":
      return "/site";
    case "project_manager":
      return "/projects";
    case "accountant":
      return "/finance";
  }
}

const rolePermissions: Record<UserRole, PermissionKey[]> = {
  owner: ["crm.manage", "projects.create", "site.report", "procurement.request", "procurement.manage", "finance.record", "approvals.decide"],
  project_manager: ["crm.manage", "projects.create", "site.report", "procurement.request", "procurement.manage", "approvals.decide"],
  site_engineer: ["site.report", "procurement.request"],
  accountant: ["finance.record", "procurement.manage"],
};

export function can(role: UserRole, permission: PermissionKey): boolean {
  return rolePermissions[role].includes(permission);
}

export const demoPersonByRole: Record<UserRole, string> = {
  owner: "user_meera",
  project_manager: "user_kavya",
  site_engineer: "user_arjun",
  accountant: "user_rohan",
};
