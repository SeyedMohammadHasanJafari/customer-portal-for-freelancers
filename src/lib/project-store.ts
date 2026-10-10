import fs from "fs";
import path from "path";
import os from "os";
import { MOCK_DEMO_INVOICES } from "@/lib/demo-data";

export interface StoredTask {
  id: string;
  title: string;
  description?: string | null;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  dueDate?: Date | null;
  projectId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface StoredDeliverable {
  id: string;
  name: string;
  fileUrl: string;
  fileSize?: number | null;
  projectId: string;
  createdAt: Date;
}

export interface StoredInvoice {
  id: string;
  invoiceNumber: string;
  amount: number;
  currency: string;
  status: "PENDING" | "PAID" | "OVERDUE";
  dueDate?: Date | null;
  paidAt?: Date | null;
  projectId: string;
  clientId: string;
  createdAt: Date;
  updatedAt: Date;
  project?: { title: string };
  client?: { companyName: string };
}

export interface StoredProject {
  id: string;
  title: string;
  description?: string | null;
  status: "PLANNING" | "IN_PROGRESS" | "COMPLETED" | "ON_HOLD";
  budget?: number | null;
  currency: string;
  timeline?: string | null;
  freelancerId: string;
  clientId: string;
  createdAt: Date;
  updatedAt: Date;
  tasks: StoredTask[];
  deliverables: StoredDeliverable[];
  invoices: StoredInvoice[];
  client?: {
    id: string;
    companyName: string;
    user?: { name: string | null; email: string | null; image?: string | null };
  };
}

export interface StoredClient {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone?: string | null;
  notes?: string | null;
  freelancerId: string;
  status: "ACTIVE";
  createdAt: Date;
  updatedAt: Date;
  user: {
    name: string;
    email: string;
    image?: string | null;
  };
  projects: StoredProject[];
  invoices: StoredInvoice[];
}

const BASE_STORE_DIR = process.env.VERCEL ? os.tmpdir() : process.cwd();
const PROJECTS_STORE_PATH = path.join(BASE_STORE_DIR, ".projects-store.json");
const INVOICES_STORE_PATH = path.join(BASE_STORE_DIR, ".invoices-store.json");
const CLIENTS_STORE_PATH = path.join(BASE_STORE_DIR, ".clients-store.json");

function getProjectsMap(): Map<string, StoredProject> {
  const map = new Map<string, StoredProject>();

  try {
    if (fs.existsSync(PROJECTS_STORE_PATH)) {
      const content = fs.readFileSync(PROJECTS_STORE_PATH, "utf-8");
      const list: StoredProject[] = JSON.parse(content);
      for (const p of list) {
        map.set(p.id, {
          ...p,
          createdAt: new Date(p.createdAt),
          updatedAt: new Date(p.updatedAt),
          tasks: (p.tasks || []).map((t) => ({
            ...t,
            createdAt: new Date(t.createdAt),
            updatedAt: new Date(t.updatedAt),
          })),
          deliverables: (p.deliverables || []).map((d) => ({
            ...d,
            createdAt: new Date(d.createdAt),
          })),
          invoices: (p.invoices || []).map((inv) => ({
            ...inv,
            createdAt: new Date(inv.createdAt),
            updatedAt: new Date(inv.updatedAt),
            dueDate: inv.dueDate ? new Date(inv.dueDate) : null,
            paidAt: inv.paidAt ? new Date(inv.paidAt) : null,
          })),
        });
      }
    }
  } catch (e) {
    console.warn("Could not read projects store:", (e as Error).message);
  }

  return map;
}

function persistProjects(mapToPersist?: Map<string, StoredProject>) {
  try {
    const targetMap = mapToPersist || getProjectsMap();
    const list = Array.from(targetMap.values());
    fs.writeFileSync(PROJECTS_STORE_PATH, JSON.stringify(list, null, 2), "utf-8");
  } catch (e) {
    console.warn("Could not write projects store:", (e as Error).message);
  }
}

export function saveProjectToLocalStore(project: StoredProject): void {
  const map = getProjectsMap();
  map.set(project.id, project);
  persistProjects(map);
}

export function getLocalProjectsByFreelancer(freelancerId: string): StoredProject[] {
  const map = getProjectsMap();
  return Array.from(map.values())
    .filter((p) => p.freelancerId === freelancerId)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

export function getLocalProjectById(projectId: string): StoredProject | null {
  const map = getProjectsMap();
  return map.get(projectId) || null;
}

export function updateProjectInLocalStore(
  projectId: string,
  updates: Partial<StoredProject>
): boolean {
  const map = getProjectsMap();
  const p = map.get(projectId);
  if (!p) return false;

  const updated: StoredProject = {
    ...p,
    ...updates,
    updatedAt: new Date(),
  };
  map.set(projectId, updated);
  persistProjects(map);
  return true;
}

export function updateTaskStatusInLocalStore(
  taskId: string,
  status: "TODO" | "IN_PROGRESS" | "DONE"
): boolean {
  const map = getProjectsMap();
  for (const p of map.values()) {
    const task = p.tasks.find((t) => t.id === taskId);
    if (task) {
      task.status = status;
      task.updatedAt = new Date();
      p.updatedAt = new Date();
      persistProjects(map);
      return true;
    }
  }
  return false;
}

export function deleteProjectFromLocalStore(projectId: string): boolean {
  const map = getProjectsMap();
  const deleted = map.delete(projectId);
  if (deleted) persistProjects(map);
  return deleted;
}

// Invoice store functions
function getInvoicesMap(): Map<string, StoredInvoice> {
  const map = new Map<string, StoredInvoice>();
  try {
    if (fs.existsSync(INVOICES_STORE_PATH)) {
      const content = fs.readFileSync(INVOICES_STORE_PATH, "utf-8");
      const list: StoredInvoice[] = JSON.parse(content);
      for (const inv of list) {
        map.set(inv.id, {
          ...inv,
          createdAt: new Date(inv.createdAt),
          updatedAt: new Date(inv.updatedAt),
          dueDate: inv.dueDate ? new Date(inv.dueDate) : null,
          paidAt: inv.paidAt ? new Date(inv.paidAt) : null,
        });
      }
    }
  } catch (e) {
    console.warn("Could not read invoices store:", (e as Error).message);
  }
  return map;
}

function persistInvoices(mapToPersist?: Map<string, StoredInvoice>) {
  try {
    const targetMap = mapToPersist || getInvoicesMap();
    const list = Array.from(targetMap.values());
    fs.writeFileSync(INVOICES_STORE_PATH, JSON.stringify(list, null, 2), "utf-8");
  } catch (e) {
    console.warn("Could not write invoices store:", (e as Error).message);
  }
}

export function saveInvoiceToLocalStore(invoice: StoredInvoice): void {
  const map = getInvoicesMap();
  map.set(invoice.id, invoice);
  persistInvoices(map);

  // Also attach to project if exists
  const projMap = getProjectsMap();
  let proj = projMap.get(invoice.projectId);
  if (!proj) {
    for (const p of projMap.values()) {
      if (p.id === invoice.projectId || projMap.size === 1) {
        proj = p;
        break;
      }
    }
  }
  if (proj) {
    proj.invoices = proj.invoices || [];
    const existsIdx = proj.invoices.findIndex((i) => i.id === invoice.id || i.invoiceNumber === invoice.invoiceNumber);
    if (existsIdx >= 0) {
      proj.invoices[existsIdx] = invoice;
    } else {
      proj.invoices.unshift(invoice);
    }
    persistProjects(projMap);
  }
}

export function getLocalInvoicesByFreelancer(freelancerId: string): StoredInvoice[] {
  const invMap = getInvoicesMap();
  const projMap = getProjectsMap();
  const userProjectIds = new Set(
    Array.from(projMap.values())
      .filter((p) => p.freelancerId === freelancerId)
      .map((p) => p.id)
  );

  return Array.from(invMap.values())
    .filter((inv) => userProjectIds.has(inv.projectId))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getAllLocalProjects(): StoredProject[] {
  const map = getProjectsMap();
  return Array.from(map.values()).sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

export function getAllLocalInvoices(): StoredInvoice[] {
  const map = getInvoicesMap();
  return Array.from(map.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function markLocalInvoicePaid(invoiceIdOrNumber: string): boolean {
  const invMap = getInvoicesMap();
  const projMap = getProjectsMap();
  const now = new Date();
  let found = false;

  // 1. Update in invoices store
  for (const [id, inv] of invMap.entries()) {
    if (
      id === invoiceIdOrNumber ||
      inv.invoiceNumber === invoiceIdOrNumber ||
      id.toLowerCase() === invoiceIdOrNumber.toLowerCase() ||
      inv.invoiceNumber.toLowerCase() === invoiceIdOrNumber.toLowerCase()
    ) {
      inv.status = "PAID";
      inv.paidAt = now;
      inv.updatedAt = now;
      found = true;
    }
  }

  // 2. Update in projects store
  for (const p of projMap.values()) {
    if (p.invoices) {
      for (const inv of p.invoices) {
        if (
          inv.id === invoiceIdOrNumber ||
          inv.invoiceNumber === invoiceIdOrNumber ||
          inv.id.toLowerCase() === invoiceIdOrNumber.toLowerCase() ||
          inv.invoiceNumber.toLowerCase() === invoiceIdOrNumber.toLowerCase()
        ) {
          inv.status = "PAID";
          inv.paidAt = now;
          inv.updatedAt = now;
          found = true;

          // Sync into invMap if not present
          if (!invMap.has(inv.id)) {
            invMap.set(inv.id, { ...inv, status: "PAID", paidAt: now, updatedAt: now });
          }
        }
      }
    }
  }

  // 3. Update in mock demo invoices if applicable
  try {
    for (const inv of MOCK_DEMO_INVOICES) {
      if (
        inv.id === invoiceIdOrNumber ||
        inv.invoiceNumber === invoiceIdOrNumber ||
        inv.id.toLowerCase() === invoiceIdOrNumber.toLowerCase() ||
        inv.invoiceNumber.toLowerCase() === invoiceIdOrNumber.toLowerCase()
      ) {
        inv.status = "PAID";
        inv.paidAt = now;
        found = true;
      }
    }
  } catch {
    // ignore
  }

  // If found anywhere or if invoice needs to be marked, persist both stores!
  persistInvoices(invMap);
  persistProjects(projMap);

  return found;
}

// Client store functions
function getClientsMap(): Map<string, StoredClient> {
  const map = new Map<string, StoredClient>();
  try {
    if (fs.existsSync(CLIENTS_STORE_PATH)) {
      const content = fs.readFileSync(CLIENTS_STORE_PATH, "utf-8");
      const list: StoredClient[] = JSON.parse(content);
      for (const c of list) {
        map.set(c.id, {
          ...c,
          createdAt: new Date(c.createdAt),
          updatedAt: new Date(c.updatedAt),
        });
      }
    }
  } catch (e) {
    console.warn("Could not read clients store:", (e as Error).message);
  }
  return map;
}

function persistClients(mapToPersist?: Map<string, StoredClient>) {
  try {
    const targetMap = mapToPersist || getClientsMap();
    const list = Array.from(targetMap.values());
    fs.writeFileSync(CLIENTS_STORE_PATH, JSON.stringify(list, null, 2), "utf-8");
  } catch (e) {
    console.warn("Could not write clients store:", (e as Error).message);
  }
}

export function saveClientToLocalStore(client: StoredClient): void {
  const map = getClientsMap();
  map.set(client.id, client);
  persistClients(map);
}

export function getLocalClientsByFreelancer(freelancerId: string): StoredClient[] {
  const map = getClientsMap();
  return Array.from(map.values())
    .filter((c) => c.freelancerId === freelancerId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getAllLocalClients(): StoredClient[] {
  const map = getClientsMap();
  return Array.from(map.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getLocalClientById(clientId: string): StoredClient | null {
  const map = getClientsMap();
  return map.get(clientId) || null;
}


