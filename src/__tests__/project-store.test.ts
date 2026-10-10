import { describe, it, expect } from "vitest";
import {
  getAllLocalProjects,
  getAllLocalInvoices,
  getAllLocalClients,
} from "@/lib/project-store";

describe("Local Store Persistence & Fallback", () => {
  it("should retrieve array of local projects without throwing", () => {
    const projects = getAllLocalProjects();
    expect(Array.isArray(projects)).toBe(true);
  });

  it("should retrieve array of local invoices without throwing", () => {
    const invoices = getAllLocalInvoices();
    expect(Array.isArray(invoices)).toBe(true);
  });

  it("should retrieve array of local clients without throwing", () => {
    const clients = getAllLocalClients();
    expect(Array.isArray(clients)).toBe(true);
  });
});
