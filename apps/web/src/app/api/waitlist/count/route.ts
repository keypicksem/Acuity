import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { prisma } = await import("@/lib/prisma");
    const count = await prisma.waitlist.count();
    return NextResponse.json({ count });
  } catch (err) {
    console.error("Waitlist count error:", err);
    return NextResponse.json({ count: 0 });
  }
}
