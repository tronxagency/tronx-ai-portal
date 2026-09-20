import { promises as fs } from "fs";
import path from "path";
import type { Client, Email, Review } from "./types";

type Collection = "emails" | "reviews" | "clients";

const DATA_DIR = path.join(process.cwd(), "data");
const RUNTIME_SUFFIX = ".runtime.json";

const memory: {
  emails?: Email[];
  reviews?: Review[];
  clients?: Client[];
} = {};

function seedPath(name: Collection): string {
  return path.join(DATA_DIR, `${name}.json`);
}

function runtimePath(name: Collection): string {
  return path.join(DATA_DIR, `${name}${RUNTIME_SUFFIX}`);
}

async function readJsonFile<T>(file: string): Promise<T | null> {
  try {
    const raw = await fs.readFile(file, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

async function canWrite(): Promise<boolean> {
  try {
    await fs.access(DATA_DIR);
    const probe = path.join(DATA_DIR, ".write-probe");
    await fs.writeFile(probe, "ok");
    await fs.unlink(probe);
    return true;
  } catch {
    return false;
  }
}

async function loadEmails(): Promise<Email[]> {
  if (memory.emails) return memory.emails;
  const runtime = await readJsonFile<Email[]>(runtimePath("emails"));
  if (runtime) {
    memory.emails = runtime;
    return runtime;
  }
  const seed = (await readJsonFile<Email[]>(seedPath("emails"))) ?? [];
  memory.emails = seed;
  return seed;
}

async function loadReviews(): Promise<Review[]> {
  if (memory.reviews) return memory.reviews;
  const runtime = await readJsonFile<Review[]>(runtimePath("reviews"));
  if (runtime) {
    memory.reviews = runtime;
    return runtime;
  }
  const seed = (await readJsonFile<Review[]>(seedPath("reviews"))) ?? [];
  memory.reviews = seed;
  return seed;
}

async function loadClients(): Promise<Client[]> {
  if (memory.clients) return memory.clients;
  const runtime = await readJsonFile<Client[]>(runtimePath("clients"));
  if (runtime) {
    memory.clients = runtime;
    return runtime;
  }
  const seed = (await readJsonFile<Client[]>(seedPath("clients"))) ?? [];
  memory.clients = seed;
  return seed;
}

async function persistEmails(data: Email[]): Promise<void> {
  memory.emails = data;
  if (await canWrite()) {
    await fs.writeFile(runtimePath("emails"), JSON.stringify(data, null, 2), "utf8");
  }
}

async function persistReviews(data: Review[]): Promise<void> {
  memory.reviews = data;
  if (await canWrite()) {
    await fs.writeFile(runtimePath("reviews"), JSON.stringify(data, null, 2), "utf8");
  }
}

async function persistClients(data: Client[]): Promise<void> {
  memory.clients = data;
  if (await canWrite()) {
    await fs.writeFile(runtimePath("clients"), JSON.stringify(data, null, 2), "utf8");
  }
}

export async function getEmails(): Promise<Email[]> {
  return loadEmails();
}

export async function getEmail(id: string): Promise<Email | undefined> {
  const emails = await getEmails();
  return emails.find((e) => e.id === id);
}

export async function updateEmail(
  id: string,
  patch: Partial<Email>
): Promise<Email | null> {
  const emails = await getEmails();
  const idx = emails.findIndex((e) => e.id === id);
  if (idx === -1) return null;
  const updated = { ...emails[idx], ...patch, id };
  emails[idx] = updated;
  await persistEmails(emails);
  return updated;
}

export async function getReviews(): Promise<Review[]> {
  return loadReviews();
}

export async function getReview(id: string): Promise<Review | undefined> {
  const reviews = await getReviews();
  return reviews.find((r) => r.id === id);
}

export async function updateReview(
  id: string,
  patch: Partial<Review>
): Promise<Review | null> {
  const reviews = await getReviews();
  const idx = reviews.findIndex((r) => r.id === id);
  if (idx === -1) return null;
  const updated = { ...reviews[idx], ...patch, id };
  if (patch.status === "posted" && updated.draftReply) {
    updated.postedReply = updated.draftReply;
  }
  reviews[idx] = updated;
  await persistReviews(reviews);
  return updated;
}

export async function getClients(): Promise<Client[]> {
  return loadClients();
}

export async function getClient(id: string): Promise<Client | undefined> {
  const clients = await getClients();
  return clients.find((c) => c.id === id);
}

export async function createClient(
  input: Omit<Client, "id" | "createdAt"> & { id?: string }
): Promise<Client> {
  const clients = await getClients();
  const client: Client = {
    id: input.id || `cl-${Date.now().toString(36)}`,
    name: input.name,
    industry: input.industry,
    contactEmail: input.contactEmail,
    contactName: input.contactName,
    status: input.status,
    services: input.services,
    notes: input.notes,
    createdAt: new Date().toISOString(),
  };
  clients.push(client);
  await persistClients(clients);
  return client;
}

export async function updateClient(
  id: string,
  patch: Partial<Client>
): Promise<Client | null> {
  const clients = await getClients();
  const idx = clients.findIndex((c) => c.id === id);
  if (idx === -1) return null;
  const updated = { ...clients[idx], ...patch, id };
  clients[idx] = updated;
  await persistClients(clients);
  return updated;
}

export async function deleteClient(id: string): Promise<boolean> {
  const clients = await getClients();
  const next = clients.filter((c) => c.id !== id);
  if (next.length === clients.length) return false;
  await persistClients(next);
  return true;
}

export async function getDashboardStats() {
  const [emails, reviews, clients] = await Promise.all([
    getEmails(),
    getReviews(),
    getClients(),
  ]);
  return {
    openEmails: emails.filter((e) => e.status !== "handled").length,
    criticalEmails: emails.filter(
      (e) => e.priority === "critical" && e.status !== "handled"
    ).length,
    reviewsNeedingAction: reviews.filter(
      (r) => r.status === "needs_reply" || r.status === "draft"
    ).length,
    activeClients: clients.filter((c) => c.status === "active").length,
    emails,
    reviews,
    clients,
  };
}
