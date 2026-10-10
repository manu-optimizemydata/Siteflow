import type { CompanyId } from "@/types/common";

export interface LabourEntry {
  trade: string;
  count: number;
}

export interface SitePhoto {
  id: string;
  caption: string;
  localOnly: true;
}

export type ReportStatus = "draft" | "submitted" | "reviewed";

export interface DailySiteReport {
  id: string;
  companyId: CompanyId;
  projectId: string;
  authorId: string;
  date: string;
  weather: string;
  workCompleted: string;
  workPlanned: string;
  labour: LabourEntry[];
  materialsNote: string;
  delays: string;
  safety: string;
  defects: string;
  notes: string;
  photos: SitePhoto[];
  status: ReportStatus;
}

export type AttendanceStatus = "present" | "absent" | "half_day" | "leave";

export interface AttendanceEntry {
  id: string;
  companyId: CompanyId;
  projectId: string;
  userId: string;
  date: string;
  status: AttendanceStatus;
  trade?: string;
}
