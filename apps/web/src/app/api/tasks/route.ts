import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

import { getAuthOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getServerSession(getAuthOptions());
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { prisma } = await import("@/lib/prisma");

  const tasks = await prisma.task.findMany({
    where: { userId: session.user.id, status: { not: "DONE" } },
    orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
  });

  return NextResponse.json({ tasks });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(getAuthOptions());
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body?.text && !body?.title) {
    return NextResponse.json(
      { error: "Missing required field: title" },
      { status: 400 }
    );
  }

  const { prisma } = await import("@/lib/prisma");

  const task = await prisma.task.create({
    data: {
      userId: session.user.id,
      text: body.title ?? body.text,
      title: body.title ?? body.text,
      description: body.description ?? null,
      priority: body.priority ?? "MEDIUM",
      dueDate: body.dueDate ? new Date(body.dueDate) : null,
    },
  });

  return NextResponse.json({ task }, { status: 201 });
}
