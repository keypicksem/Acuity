import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { getAuthOptions } from "@/lib/auth";
import { InsightsView } from "./insights-view";

export const dynamic = "force-dynamic";

export default async function InsightsPage() {
  const session = await getServerSession(getAuthOptions());
  if (!session?.user?.id) redirect("/auth/signin");

  return (
    <div className="min-h-screen">
      <main className="mx-auto max-w-3xl px-6 py-10 animate-fade-in">
        <InsightsView />
      </main>
    </div>
  );
}
