import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { getAuthOptions } from "@/lib/auth";
import { GoalList } from "./goal-list";

export const dynamic = "force-dynamic";

export default async function GoalsPage() {
  const session = await getServerSession(getAuthOptions());
  if (!session?.user?.id) redirect("/auth/signin");

  return (
    <div className="min-h-screen bg-zinc-950">
      <main className="mx-auto max-w-3xl px-6 py-10">
        <GoalList />
      </main>
    </div>
  );
}
