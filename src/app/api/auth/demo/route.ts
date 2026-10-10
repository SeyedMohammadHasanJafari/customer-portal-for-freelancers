import { NextResponse } from "next/server";
import { ensureDemoData, DEMO_USER_EMAIL, DEMO_USER_PASSWORD } from "@/lib/demo-seed";

export async function POST() {
  try {
    await ensureDemoData();
    return NextResponse.json({
      success: true,
      email: DEMO_USER_EMAIL,
      password: DEMO_USER_PASSWORD,
    });
  } catch (error) {
    console.error("Demo initialization error:", error);
    return NextResponse.json(
      { error: "Failed to initialize demo account." },
      { status: 500 }
    );
  }
}
