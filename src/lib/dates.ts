import { DEMO_TODAY } from "@/lib/calculations";

export function parseIsoDate(iso: string): Date {
  const [year, month, day] = iso.slice(0, 10).split("-").map(Number);
  return new Date(year, (month ?? 1) - 1, day ?? 1);
}

export function formatDate(iso: string | undefined, locale = "en-IN"): string {
  if (!iso) return "—";
  return new Intl.DateTimeFormat(locale, { day: "numeric", month: "short", year: "numeric", calendar: "gregory" }).format(parseIsoDate(iso));
}

export function formatDateTime(iso: string, locale = "en-IN"): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return formatDate(iso, locale);
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    calendar: "gregory",
  }).format(date);
}

export function addDays(iso: string, days: number): string {
  const date = parseIsoDate(iso);
  date.setDate(date.getDate() + days);
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

export function daysBetween(from: string, to: string): number {
  const ms = parseIsoDate(to).getTime() - parseIsoDate(from).getTime();
  return Math.round(ms / 86_400_000);
}

export function greetingForHour(hour: number): string {
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function demoTodayLabel(): string {
  return formatDate(DEMO_TODAY);
}

export function isWithinRange(iso: string, from?: string, to?: string): boolean {
  const day = iso.slice(0, 10);
  if (from && day < from) return false;
  if (to && day > to) return false;
  return true;
}
