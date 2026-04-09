import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { getAuthOptions } from "@/lib/auth";
import { PLAN_PRO_NAME } from "@acuity/shared";
import { UpgradeButton } from "./upgrade-button";

export const dynamic = "force-dynamic";

export default async function UpgradePage() {
  const session = await getServerSession(getAuthOptions());
  if (!session?.user?.id) redirect("/auth/signin");

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-4xl mb-4">⚡</div>
          <h1 className="text-2xl font-bold text-zinc-50 mb-2">
            Upgrade to {PLAN_PRO_NAME}
          </h1>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Unlock the full power of your nightly brain dumps.
          </p>
        </div>

        {/* Pricing card */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 mb-6">
          <div className="flex items-baseline gap-1 mb-6">
            <span className="text-3xl font-bold text-zinc-50">$19</span>
            <span className="text-sm text-zinc-500">/month</span>
          </div>

          <ul className="space-y-3 mb-6">
            {[
              "Unlimited recordings",
              "Weekly AI reports",
              "Goal tracking & progress",
              "Life map analytics",
              "Mood trend insights",
              "Priority support",
            ].map((feature) => (
              <li key={feature} className="flex items-center gap-2.5 text-sm text-zinc-300">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#8B5CF6"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="shrink-0"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                {feature}
              </li>
            ))}
          </ul>

          <UpgradeButton />

          <p className="mt-3 text-center text-xs text-zinc-600">
            7-day free trial. Cancel anytime.
          </p>
        </div>

        <a
          href="/dashboard"
          className="block text-center text-sm text-zinc-500 hover:text-zinc-300 transition"
        >
          Back to dashboard
        </a>
      </div>
    </div>
  );
}
