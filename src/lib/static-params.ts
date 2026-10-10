import { createSeedDatabase } from "@/mocks/seed";

const seed = createSeedDatabase();

export function projectStaticParams() {
  return seed.projects.map((project) => ({ projectId: project.id }));
}

export function leadStaticParams() {
  return seed.leads.map((lead) => ({ leadId: lead.id }));
}

export function clientStaticParams() {
  return seed.clients.map((client) => ({ clientId: client.id }));
}

export function estimateStaticParams() {
  return seed.estimates.map((estimate) => ({ estimateId: estimate.id }));
}

export function quotationStaticParams() {
  return seed.quotations.map((quotation) => ({ quotationId: quotation.id }));
}
