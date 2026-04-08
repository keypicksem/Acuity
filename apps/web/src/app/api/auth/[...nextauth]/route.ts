import NextAuth from "next-auth";

import { getAuthOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

// Lazily create the handler so getAuthOptions() (and prisma) are never
// instantiated at module load time during the Next.js build phase.
let _handler: ReturnType<typeof NextAuth> | undefined;
function getHandler() {
  return (_handler ??= NextAuth(getAuthOptions()));
}

export function GET(...args: Parameters<ReturnType<typeof NextAuth>>) {
  return getHandler()(...args);
}
export const POST = GET;
