import { describe, it, expect } from "vitest";
import { getClientPortalData } from "@/lib/services/portal";

describe("Client Portal Service", () => {
  it("should return populated demo portal data for demo identifier", async () => {
    const data = await getClientPortalData("demo");

    expect(data).toBeDefined();
    expect(data.companyName).toBe("Apex Tech Labs");
    expect(data.clientName).toBe("Sarah Jenkins");
    expect(data.freelancerName).toBe("Alex Vance");
    expect(data.projects.length).toBeGreaterThan(0);
    expect(data.deliverables.length).toBeGreaterThan(0);
    expect(data.invoices.length).toBeGreaterThan(0);
  });

  it("should calculate correct outstanding amount and progress for demo", async () => {
    const data = await getClientPortalData("demo");

    expect(data.totalOutstanding).toBeGreaterThan(0);
    expect(data.overallProgress).toBeGreaterThanOrEqual(0);
    expect(data.overallProgress).toBeLessThanOrEqual(100);
  });

  it("should handle empty or whitespace identifiers gracefully by falling back to demo", async () => {
    const data = await getClientPortalData("   ");

    expect(data).toBeDefined();
    expect(data.companyName).toBe("Apex Tech Labs");
  });
});
