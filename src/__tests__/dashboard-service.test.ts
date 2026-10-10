import { describe, it, expect } from "vitest";
import { getFreelancerDashboardData } from "@/lib/services/dashboard";

describe("Freelancer Dashboard Service", () => {
  it("should return populated overview data in demo mode", async () => {
    const data = await getFreelancerDashboardData("demo-user-id", true);

    expect(data).toBeDefined();
    expect(data.projects.length).toBeGreaterThan(0);
    expect(data.clients.length).toBeGreaterThan(0);
    expect(data.invoices.length).toBeGreaterThan(0);
    expect(data.totalRevenue).toBeGreaterThanOrEqual(0);
    expect(data.pendingRevenue).toBeGreaterThanOrEqual(0);
    expect(Array.isArray(data.monthlyRevenue)).toBe(true);
    expect(data.monthlyRevenue.length).toBe(6);
  });

  it("should calculate active projects count correctly", async () => {
    const data = await getFreelancerDashboardData("demo-user-id", true);

    expect(data.activeProjectsCount).toBeGreaterThanOrEqual(0);
    expect(data.activeProjectsCount).toBeLessThanOrEqual(data.projects.length);
  });
});
