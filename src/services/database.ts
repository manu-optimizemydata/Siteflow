import { createSeedDatabase } from "@/mocks/seed";
import type { Database } from "@/mocks/types";

const STORAGE_KEY = "siteflow-data-v3";

let database: Database = createSeedDatabase();
let failNext = false;
const listeners = new Set<() => void>();

export function getDatabase(): Database {
  return database;
}

export function subscribeDatabase(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function publish(): void {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(database));
  }
  listeners.forEach((listener) => listener());
}

export function hydrateDatabase(): void {
  if (typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw) as Database;
    if (!parsed || parsed.version !== 1 || !Array.isArray(parsed.projects)) return;
    database = parsed;
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
  }
}

export function mutateDatabase(recipe: (draft: Database) => void): void {
  const next = structuredClone(database);
  recipe(next);
  database = next;
  publish();
}

export function resetDatabase(): void {
  database = createSeedDatabase();
  if (typeof window !== "undefined") window.localStorage.removeItem(STORAGE_KEY);
  listeners.forEach((listener) => listener());
}

export function armSimulatedFailure(): void {
  failNext = true;
}

export async function gate(ms = 200): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
  if (failNext) {
    failNext = false;
    throw new Error("Simulated request failure. No records were changed.");
  }
}
