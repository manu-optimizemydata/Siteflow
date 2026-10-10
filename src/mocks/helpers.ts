import type { Address } from "@/types/common";
import { COMPANY_ID } from "@/types/common";

export const companyId = COMPANY_ID;

export function addr(line1: string, area: string, postalCode: string, city = "Bengaluru"): Address {
  return { line1, area, city, state: "Karnataka", postalCode };
}

export function at(day: string, time = "10:00"): string {
  return `${day}T${time}:00+05:30`;
}
