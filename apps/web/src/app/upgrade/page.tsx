import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { getAuthOptions } from "@/lib/auth";
import { PLAN_PRO_NAME } from "@acuity/shared";

export const dynamic = "force-dynamic";

export default async function UpgradePage() {
  const session = await getServerSession(getAuthOptions());
  if (!session?.user?.id) redirect("/auth/signin");

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-6">
      <div className="w-full max-w-sm text-center">
        <div className="text-4xl mb-4">⚡</div>
        <h1 className="text-2xl font-bold text-zinc-50 mb-2">
          Upgrade to {PLAN_PRO_NAME}
        </h1>
        <p className="text-sm text-zinc-400 mb-8 leading-relaxed">
          Unlimited brain dumps, weekly synthesis reports, and AI-powered
          goal tracking.
        </p>

        <button
          className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-3.5 text-sm font-semibold text-white hover:opacity-90 transition"
          disabled
        >
          Coming soon
        </button>

        <a
          href="/dashboard"
          className="mt-4 block text-sm text-zinc-500 hover:text-zinc-300 transition"
        >
          Back to dashboard
        </a>
      </div>
    </div>
  );
}
