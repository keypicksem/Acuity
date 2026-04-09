"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/tasks", label: "Tasks" },
  { href: "/goals", label: "Goals" },
  { href: "/insights", label: "Insights" },
  { href: "/upgrade", label: "Upgrade" },
];

export function NavBar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  // Don't show nav on auth pages or landing
  if (!session || pathname?.startsWith("/auth") || pathname === "/") {
    return null;
  }

  const user = session.user;
  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : user.email?.charAt(0).toUpperCase() ?? "?";

  return (
    <nav className="border-b border-zinc-800 px-6 py-3">
      <div className="mx-auto flex max-w-5xl items-center justify-between">
        {/* Left: logo + links */}
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 text-sm">
              ✦
            </div>
            <span className="font-semibold text-zinc-100 hidden sm:block">
              Acuity
            </span>
          </Link>

          <div className="flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                    isActive
                      ? "bg-zinc-800 text-zinc-50"
                      : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right: user info */}
        <div className="flex items-center gap-3">
          {user.image ? (
            <img
              src={user.image}
              alt=""
              className="h-7 w-7 rounded-full"
            />
          ) : (
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-800 text-xs font-medium text-zinc-400">
              {initials}
            </div>
          )}
          <span className="text-sm text-zinc-400 hidden sm:block">
            {user.name ?? user.email}
          </span>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="text-sm text-zinc-600 hover:text-zinc-300 transition"
          >
            Sign out
          </button>
        </div>
      </div>
    </nav>
  );
}
