import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { getAuthOptions } from "@/lib/auth";
import { LandingPage } from "@/components/landing";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const session = await getServerSession(getAuthOptions());
  if (session) redirect("/dashboard");

  return <LandingPage />;
}
