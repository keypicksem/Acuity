import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { getAuthOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getServerSession(getAuthOptions());
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { prisma } = await import("@/lib/prisma");

  const reports = await prisma.weeklyReport.findMany({
    where: { userId: session.user.id },
    orderBy: { weekStart: "desc" },
    take: 10,
  });

  return NextResponse.json({ reports });
}
