"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/tasks", label: "Tasks" },
  { href: "/goals", label: "Goals" },
  { href: "/insights", label: "Insights" },
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
    <nav className="sticky top-0 z-50 border-b border-zinc-200/60 bg-[#FAFAF7]/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
        {/* Left: logo + links */}
        <div className="flex items-center gap-6">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 group"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-sm text-white transition-transform duration-300 group-hover:rotate-12">
              ✦
            </div>
            <span className="font-semibold text-zinc-900 hidden sm:block tracking-tight">
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
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-white text-zinc-900 shadow-sm"
                      : "text-zinc-500 hover:text-zinc-900 hover:bg-white/60"
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
              className="h-7 w-7 rounded-full ring-2 ring-white"
            />
          ) : (
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-200 text-xs font-medium text-zinc-600">
              {initials}
            </div>
          )}
          <span className="text-sm text-zinc-600 hidden sm:block">
            {user.name ?? user.email}
          </span>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="text-sm text-zinc-400 hover:text-zinc-700 transition"
          >
            Sign out
          </button>
        </div>
      </div>
    </nav>
  );
}
