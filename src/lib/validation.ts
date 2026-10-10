import { z } from "zod";

export const phoneSchema = z
  .string()
  .trim()
  .refine((value) => /^[6-9]\d{9}$/.test(value.replace(/[\s-]/g, "").replace(/^\+91/, "")), "Enter a valid 10-digit Indian mobile number");

export const leadStages = ["new", "contacted", "site_visit", "estimation", "quotation", "negotiation", "won", "lost"] as const;
export const projectTypes = ["villa", "apartment", "independent_house", "office_fitout", "commercial", "industrial"] as const;
export const leadSources = ["referral", "website", "architect", "repeat", "walk_in", "broker"] as const;
export const costCategories = ["materials", "labour", "subcontractors", "equipment", "overhead", "other"] as const;

export const leadFormSchema = z.object({
  title: z.string().trim().min(3, "Enter a lead title"),
  contactName: z.string().trim().min(2, "Enter the contact name"),
  organization: z.string().trim().optional(),
  phone: phoneSchema,
  email: z.string().trim().email("Enter a valid email"),
  source: z.enum(leadSources),
  projectType: z.enum(projectTypes),
  area: z.string().trim().min(2, "Enter the site area"),
  city: z.string().trim().min(2, "Enter the city"),
  estimatedValue: z.coerce.number().positive("Enter an estimated value"),
  stage: z.enum(leadStages),
  ownerId: z.string().min(1, "Choose an owner"),
  nextFollowUp: z.string().optional(),
  notes: z.string().trim().optional(),
});

export const projectFormSchema = z
  .object({
    name: z.string().trim().min(3, "Enter a project name"),
    code: z.string().trim().min(3, "Enter a project code"),
    clientId: z.string().min(1, "Choose a client"),
    type: z.enum(projectTypes),
    area: z.string().trim().min(2, "Enter the site area"),
    city: z.string().trim().min(2, "Enter the city"),
    managerId: z.string().min(1, "Choose a project manager"),
    siteEngineerId: z.string().min(1, "Choose a site engineer"),
    startDate: z.string().min(1, "Choose a start date"),
    plannedEndDate: z.string().min(1, "Choose a planned completion"),
    contractValue: z.coerce.number().positive("Enter the contract value"),
    budget: z.coerce.number().positive("Enter the project budget"),
    description: z.string().trim().min(8, "Add a short description"),
  })
  .refine((value) => value.plannedEndDate >= value.startDate, {
    message: "Completion must be on or after the start date",
    path: ["plannedEndDate"],
  });

export const dailyReportSchema = z.object({
  projectId: z.string().min(1, "Choose a project"),
  date: z.string().min(1, "Choose the report date"),
  weather: z.string().trim().min(2, "Describe the site conditions"),
  workCompleted: z.string().trim().min(8, "Describe the work completed"),
  workPlanned: z.string().trim().min(8, "Describe the next plan"),
  labourCount: z.coerce.number().int().min(0, "Labour count cannot be negative"),
  masonCount: z.coerce.number().int().min(0).optional(),
  helperCount: z.coerce.number().int().min(0).optional(),
  materialsNote: z.string().trim().optional(),
  delays: z.string().trim().optional(),
  safety: z.string().trim().optional(),
  defects: z.string().trim().optional(),
  notes: z.string().trim().optional(),
  photoCaption: z.string().trim().optional(),
});

export const expenseFormSchema = z.object({
  projectId: z.string().min(1, "Choose a project"),
  category: z.enum(costCategories),
  vendorName: z.string().trim().min(2, "Enter the vendor"),
  date: z.string().min(1, "Choose a date"),
  amount: z.coerce.number().positive("Enter an amount"),
  reference: z.string().trim().min(2, "Enter a reference"),
  notes: z.string().trim().optional(),
  hasReceipt: z.boolean(),
});

export const invoiceLineSchema = z.object({
  description: z.string().trim().min(2, "Enter a description"),
  quantity: z.coerce.number().positive("Quantity must be greater than zero"),
  unitRate: z.coerce.number().min(0, "Rate cannot be negative"),
  taxRate: z.coerce.number().min(0, "Tax cannot be negative").max(100, "Tax looks too high for this demo"),
});

export const invoiceFormSchema = z
  .object({
    clientId: z.string().min(1, "Choose a client"),
    projectId: z.string().min(1, "Choose a project"),
    issueDate: z.string().min(1, "Choose an issue date"),
    dueDate: z.string().min(1, "Choose a due date"),
    description: z.string().trim().min(3, "Describe the billed work"),
    quantity: z.coerce.number().positive("Quantity must be greater than zero"),
    unitRate: z.coerce.number().min(0),
    taxRate: z.coerce.number().min(0).max(100),
    notes: z.string().trim().optional(),
  })
  .refine((value) => value.dueDate >= value.issueDate, {
    message: "Due date must be on or after the issue date",
    path: ["dueDate"],
  });

export const materialRequestSchema = z.object({
  projectId: z.string().min(1, "Choose a project"),
  materialId: z.string().min(1, "Choose a material"),
  quantity: z.coerce.number().positive("Enter a quantity"),
  needBy: z.string().min(1, "Choose a need-by date"),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  reason: z.string().trim().min(8, "Explain why this is needed"),
});

export const taskFormSchema = z.object({
  projectId: z.string().min(1, "Choose a project"),
  title: z.string().trim().min(3, "Enter a task title"),
  description: z.string().trim().optional(),
  assigneeId: z.string().min(1, "Choose an assignee"),
  dueDate: z.string().min(1, "Choose a due date"),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  category: z.enum(["quality", "schedule", "procurement", "safety", "client", "admin"]),
});

export const clientFormSchema = z.object({
  name: z.string().trim().min(2, "Enter the client name"),
  kind: z.enum(["individual", "organization"]),
  type: z.enum(["residential", "commercial"]),
  phone: phoneSchema,
  email: z.string().trim().email("Enter a valid email"),
  area: z.string().trim().min(2, "Enter an area"),
  city: z.string().trim().min(2, "Enter the city"),
  contactName: z.string().trim().min(2, "Enter the contact name"),
  notes: z.string().trim().optional(),
});

export type LeadFormValues = z.infer<typeof leadFormSchema>;
export type ProjectFormValues = z.infer<typeof projectFormSchema>;
export type DailyReportValues = z.infer<typeof dailyReportSchema>;
export type ExpenseFormValues = z.infer<typeof expenseFormSchema>;
export type InvoiceFormValues = z.infer<typeof invoiceFormSchema>;
export type MaterialRequestValues = z.infer<typeof materialRequestSchema>;
export type TaskFormValues = z.infer<typeof taskFormSchema>;
export type ClientFormValues = z.infer<typeof clientFormSchema>;
