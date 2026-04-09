import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { getAuthOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function TasksPage() {
  const session = await getServerSession(getAuthOptions());
  if (!session?.user?.id) redirect("/auth/signin");

  return (
    <div className="min-h-screen bg-zinc-950">
      <main className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="text-2xl font-bold text-zinc-50 mb-1">Tasks</h1>
        <p className="text-sm text-zinc-400 mb-8">
          Actions extracted from your brain dumps.
        </p>

        <div className="rounded-xl border border-dashed border-zinc-800 px-6 py-16 text-center">
          <div className="text-3xl mb-3">✅</div>
          <p className="text-sm font-medium text-zinc-400">No open tasks</p>
          <p className="mt-1 text-xs text-zinc-600">
            Record a session to extract tasks automatically.
          </p>
        </div>
      </main>
    </div>
  );
}
