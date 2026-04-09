import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { getAuthOptions } from "@/lib/auth";
import { TaskList } from "./task-list";

export const dynamic = "force-dynamic";

export default async function TasksPage() {
  const session = await getServerSession(getAuthOptions());
  if (!session?.user?.id) redirect("/auth/signin");

  return (
    <div className="min-h-screen bg-zinc-950">
      <main className="mx-auto max-w-3xl px-6 py-10">
        <TaskList />
      </main>
    </div>
  );
}
