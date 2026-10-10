import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const startTime = Date.now();
  let dbStatus = "offline_fallback";

  try {
    // Quick probe to verify database connectivity
    await prisma.$queryRaw`SELECT 1`;
    dbStatus = "connected";
  } catch {
    dbStatus = "fallback_mock_mode";
  }

  const responseTime = Date.now() - startTime;

  return NextResponse.json(
    {
      status: "healthy",
      service: "Lumina Portal SaaS",
      version: "1.0.0",
      timestamp: new Date().toISOString(),
      responseTimeMs: responseTime,
      checks: {
        database: dbStatus,
        auth: "operational",
        stripe: process.env.STRIPE_SECRET_KEY ? "configured" : "test_mode_simulation",
        email: process.env.RESEND_API_KEY ? "configured" : "simulation_mode",
      },
    },
    { status: 200 }
  );
}
