import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { getAuthOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const session = await getServerSession(getAuthOptions());
  if (session) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-[#FAFAF7] text-zinc-900">
      {/* ───── NAVBAR ───── */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-[#FAFAF7]/80 backdrop-blur-md border-b border-zinc-200/60">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl">✦</span>
              <span className="text-lg font-bold tracking-tight">Acuity</span>
            </Link>
            <div className="hidden sm:flex items-center gap-6 text-sm text-zinc-500">
              <a href="#" className="transition hover:text-zinc-900">
                Home
              </a>
              <a
                href="#how-it-works"
                className="transition hover:text-zinc-900"
              >
                How it Works
              </a>
              <a href="#pricing" className="transition hover:text-zinc-900">
                Pricing
              </a>
              <a href="#" className="transition hover:text-zinc-900">
                Press
              </a>
            </div>
          </div>
          <Link
            href="/auth/signin"
            className="rounded-full bg-zinc-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-zinc-700 active:scale-95"
          >
            Download App
          </Link>
        </div>
      </nav>

      {/* ───── HERO ───── */}
      <section className="relative overflow-hidden pt-28 pb-16 sm:pt-36 sm:pb-24">
        {/* Soft gradient background */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-[#FAFAF7] via-[#F0EEFF] to-[#E8F4FD]"
        />

        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:gap-16">
            {/* Left content */}
            <div className="flex-1 max-w-xl">
              {/* Social proof badge */}
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-1.5 text-sm text-zinc-600 shadow-sm">
                <span>Loved by early users</span>
                <span>⭐</span>
                <span className="text-zinc-400">|</span>
                <Link
                  href="/auth/signin"
                  className="font-medium text-zinc-900 hover:underline"
                >
                  Join the waitlist
                </Link>
              </div>

              <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl leading-[1.05]">
                Meet Acuity.
                <br />
                Brain dump daily.
                <br />
                <span className="text-zinc-400">Get your life back.</span>
              </h1>

              <p className="mt-6 text-lg text-zinc-500 leading-relaxed max-w-md">
                Speak for 60 seconds. AI extracts your tasks, goals, mood, and
                weekly insights — automatically.
              </p>

              {/* App store buttons */}
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/auth/signin"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-900 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-zinc-700 active:scale-95"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                  </svg>
                  Download on App Store
                </Link>
                <Link
                  href="/auth/signin"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-900 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-zinc-700 active:scale-95"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-1.6l2.651 1.535c.9.521.9 1.196 0 1.717l-2.651 1.535-2.535-2.535 2.535-2.253zM5.864 2.658L16.8 8.991l-2.302 2.302-8.634-8.635z" />
                  </svg>
                  Get it on Google Play
                </Link>
              </div>
            </div>

            {/* Right side: Phone mockups */}
            <div className="flex-1 mt-12 lg:mt-0 flex justify-center lg:justify-end">
              <div className="relative w-[320px] h-[580px] sm:w-[380px] sm:h-[640px]">
                {/* Phone 1 (back) */}
                <div className="absolute right-0 top-8 w-[220px] sm:w-[260px] h-[440px] sm:h-[500px] rounded-[2rem] bg-zinc-900 p-2 shadow-2xl rotate-3">
                  <div className="h-full w-full rounded-[1.5rem] bg-zinc-800 p-4 flex flex-col gap-3 overflow-hidden">
                    <div className="text-xs text-zinc-500 font-medium">
                      Weekly Report
                    </div>
                    <div className="rounded-xl bg-zinc-700/50 p-3">
                      <div className="text-xs text-zinc-400 mb-2">
                        Mood Trend
                      </div>
                      <div className="flex items-end gap-1 h-12">
                        {[40, 55, 45, 70, 65, 80, 75].map((h, i) => (
                          <div
                            key={i}
                            className="flex-1 rounded-sm bg-violet-500/60"
                            style={{ height: `${h}%` }}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="rounded-xl bg-zinc-700/50 p-3">
                      <div className="text-xs text-zinc-400 mb-1">
                        Top Insight
                      </div>
                      <div className="text-xs text-zinc-300">
                        You mention &ldquo;sleep&rdquo; 4x this week. Consider
                        a wind-down routine.
                      </div>
                    </div>
                    <div className="rounded-xl bg-zinc-700/50 p-3">
                      <div className="text-xs text-zinc-400 mb-1">
                        Goals Progress
                      </div>
                      <div className="space-y-2">
                        <div>
                          <div className="flex justify-between text-xs text-zinc-300 mb-1">
                            <span>Exercise</span>
                            <span>3/5</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-zinc-600">
                            <div className="h-full w-3/5 rounded-full bg-green-500" />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-xs text-zinc-300 mb-1">
                            <span>Reading</span>
                            <span>5/7</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-zinc-600">
                            <div className="h-full w-5/6 rounded-full bg-violet-500" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Phone 2 (front) */}
                <div className="absolute left-0 top-0 w-[220px] sm:w-[260px] h-[440px] sm:h-[500px] rounded-[2rem] bg-zinc-900 p-2 shadow-2xl -rotate-3 z-10">
                  <div className="h-full w-full rounded-[1.5rem] bg-zinc-800 p-4 flex flex-col gap-3 overflow-hidden">
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-zinc-500 font-medium">
                        Today&apos;s Dump
                      </div>
                      <div className="flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] text-emerald-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        Good mood
                      </div>
                    </div>
                    <div className="rounded-xl bg-zinc-700/50 p-3">
                      <div className="text-xs text-zinc-400 mb-2">
                        Extracted Tasks
                      </div>
                      <div className="space-y-2">
                        {[
                          "Email Q2 report to team",
                          "Book dentist appointment",
                          "Review PR #42",
                        ].map((task) => (
                          <div
                            key={task}
                            className="flex items-center gap-2 text-xs text-zinc-300"
                          >
                            <div className="h-3.5 w-3.5 rounded border border-zinc-500 shrink-0" />
                            {task}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-xl bg-zinc-700/50 p-3">
                      <div className="text-xs text-zinc-400 mb-1">
                        Key Theme
                      </div>
                      <div className="text-xs text-zinc-300">
                        Feeling productive but stretched thin on side projects.
                      </div>
                    </div>
                    <div className="rounded-xl bg-violet-600/20 p-3">
                      <div className="text-xs text-violet-300 mb-1">
                        Goal Detected
                      </div>
                      <div className="text-xs text-zinc-300">
                        &ldquo;Launch MVP by end of month&rdquo;
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───── SOCIAL PROOF STRIP ───── */}
      {/* TODO: Replace placeholder avatars with real influencer/user photos */}
      <section className="py-16 px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h3 className="text-lg font-semibold text-zinc-600">
            Used by productivity obsessives 👀
          </h3>
          <div className="mt-6 flex justify-center -space-x-3">
            {["S", "M", "P", "A", "J", "R"].map((letter, i) => (
              <div
                key={i}
                className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#FAFAF7] bg-zinc-200 text-sm font-semibold text-zinc-500"
              >
                {letter}
              </div>
            ))}
            <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#FAFAF7] bg-zinc-900 text-xs font-semibold text-white">
              +99
            </div>
          </div>
        </div>
      </section>

      {/* ───── HOW IT WORKS ───── */}
      <section id="how-it-works" className="px-6 py-24 sm:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-20">
            <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">
              How it works
            </h2>
            <p className="mt-4 text-zinc-500 text-lg">
              Three steps. Sixty seconds. Zero effort.
            </p>
          </div>

          <div className="space-y-32">
            {steps.map((step, i) => (
              <div
                key={step.title}
                className={`flex flex-col gap-12 lg:items-center ${
                  i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                }`}
              >
                {/* Text */}
                <div className="flex-1">
                  <div className="inline-flex items-center gap-2 rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">
                    Step {i + 1}
                  </div>
                  <h3 className="text-3xl font-bold sm:text-4xl">
                    {step.title}
                  </h3>
                  <p className="mt-4 text-lg text-zinc-500 leading-relaxed max-w-md">
                    {step.desc}
                  </p>
                </div>

                {/* Phone mockup */}
                <div className="flex-1 flex justify-center">
                  <div className="w-[240px] h-[460px] rounded-[2.5rem] bg-zinc-900 p-2 shadow-xl">
                    <div className="h-full w-full rounded-[2rem] bg-zinc-800 p-5 flex flex-col overflow-hidden">
                      {step.screen}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── FEATURES GRID ───── */}
      <section className="px-6 py-24 sm:py-32 bg-white">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-3xl font-bold tracking-tight sm:text-5xl">
            Everything you need to stay sharp
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-center text-zinc-500 text-lg">
            One nightly habit that powers your entire week.
          </p>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border border-zinc-100 bg-[#FAFAF7] p-6 transition hover:shadow-md hover:border-zinc-200"
              >
                <div className="mb-3 text-3xl">{f.icon}</div>
                <h3 className="mb-2 text-lg font-semibold">{f.title}</h3>
                <p className="text-sm leading-relaxed text-zinc-500">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── TESTIMONIALS ───── */}
      {/* TODO: Replace fake testimonials with real user testimonials */}
      <section className="px-6 py-24 sm:py-32">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-3xl font-bold tracking-tight sm:text-5xl">
            People are loving it
          </h2>
          <p className="mx-auto mt-4 text-center text-zinc-500 text-lg">
            Join thousands reclaiming their headspace.
          </p>

          <div className="mt-16 grid gap-8 sm:grid-cols-3">
            {testimonials.map((t) => (
              <figure
                key={t.name}
                className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="h-4 w-4 text-amber-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <blockquote className="text-sm leading-relaxed text-zinc-600">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 text-sm font-bold text-zinc-500">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{t.name}</div>
                    <div className="text-xs text-zinc-400">{t.role}</div>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ───── PRICING ───── */}
      <section id="pricing" className="px-6 py-24 sm:py-32 bg-white">
        <div className="mx-auto max-w-md text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">
            Simple pricing
          </h2>
          <p className="mt-4 text-zinc-500 text-lg">
            One plan. Everything included. Cancel anytime.
          </p>

          <div className="mt-12 rounded-2xl border border-zinc-200 bg-[#FAFAF7] p-8 text-left shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wider text-violet-600">
              Pro
            </p>
            <p className="mt-4 flex items-baseline gap-1">
              <span className="text-5xl font-extrabold">$19</span>
              <span className="text-zinc-400">/month</span>
            </p>
            <p className="mt-2 text-sm text-zinc-400">
              7-day free trial &middot; no card required
            </p>

            <ul className="mt-8 space-y-3 text-sm text-zinc-600">
              {pricingFeatures.map((f) => (
                <li key={f} className="flex items-start gap-2.5">
                  <svg
                    className="mt-0.5 h-4 w-4 shrink-0 text-violet-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>

            <Link
              href="/auth/signin"
              className="mt-8 block w-full rounded-xl bg-zinc-900 py-3.5 text-center text-sm font-semibold text-white transition hover:bg-zinc-700 active:scale-95"
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      </section>

      {/* ───── FOOTER ───── */}
      <footer className="border-t border-zinc-200 px-6 py-12 bg-[#FAFAF7]">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
            {/* Logo + tagline */}
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl">✦</span>
                <span className="text-lg font-bold tracking-tight">
                  Acuity
                </span>
              </div>
              <p className="mt-2 text-sm text-zinc-400 max-w-xs">
                Brain dump daily. Get your life back.
              </p>
            </div>

            {/* Links */}
            <div className="flex items-center gap-6 text-sm text-zinc-500">
              <a href="#" className="transition hover:text-zinc-900">
                Terms
              </a>
              <a href="#" className="transition hover:text-zinc-900">
                Privacy
              </a>
              <a href="#" className="transition hover:text-zinc-900">
                Contact
              </a>
            </div>

            {/* Social */}
            <div className="flex items-center gap-4 text-sm text-zinc-500">
              <a href="#" className="transition hover:text-zinc-900">
                Twitter/X
              </a>
              <a href="#" className="transition hover:text-zinc-900">
                Instagram
              </a>
              <a href="#" className="transition hover:text-zinc-900">
                TikTok
              </a>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-zinc-200 text-center">
            <p className="text-xs text-zinc-400">
              Built with{" "}
              <span className="font-medium text-zinc-600">Claude</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ── Data ── */

import { ReactNode } from "react";

const steps: { title: string; desc: string; screen: ReactNode }[] = [
  {
    title: "Record",
    desc: "Hit record. Speak freely for 60 seconds about your day, your worries, your wins — whatever comes to mind.",
    screen: (
      <>
        <div className="text-xs text-zinc-500 font-medium mb-auto">
          Recording
        </div>
        <div className="flex flex-col items-center justify-center flex-1 gap-4">
          <div className="relative flex items-center justify-center">
            <div className="absolute h-20 w-20 rounded-full bg-red-500/20 animate-ping" />
            <div className="relative h-16 w-16 rounded-full bg-red-500 flex items-center justify-center shadow-lg shadow-red-500/30">
              <svg
                className="h-7 w-7 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
              </svg>
            </div>
          </div>
          <div className="text-xl font-bold text-white font-mono">0:47</div>
          <div className="text-xs text-zinc-500">Speak freely...</div>
        </div>
      </>
    ),
  },
  {
    title: "Extract",
    desc: "AI transcribes and extracts tasks, goals, mood, themes, and insights from your stream of consciousness.",
    screen: (
      <>
        <div className="text-xs text-zinc-500 font-medium mb-3">
          AI Extraction
        </div>
        <div className="space-y-2.5 flex-1">
          <div className="rounded-xl bg-zinc-700/50 p-3">
            <div className="text-[10px] text-zinc-400 uppercase tracking-wider mb-1.5">
              Tasks
            </div>
            {["Send proposal to client", "Buy groceries", "Call mom"].map(
              (t) => (
                <div
                  key={t}
                  className="flex items-center gap-2 text-xs text-zinc-300 py-1"
                >
                  <div className="h-3 w-3 rounded border border-zinc-500 shrink-0" />
                  {t}
                </div>
              )
            )}
          </div>
          <div className="rounded-xl bg-violet-600/20 p-3">
            <div className="text-[10px] text-violet-400 uppercase tracking-wider mb-1">
              Goal
            </div>
            <div className="text-xs text-zinc-300">
              &ldquo;Ship the beta this week&rdquo;
            </div>
          </div>
          <div className="rounded-xl bg-emerald-600/20 p-3">
            <div className="text-[10px] text-emerald-400 uppercase tracking-wider mb-1">
              Mood
            </div>
            <div className="text-xs text-zinc-300">
              Energized but slightly anxious 😊
            </div>
          </div>
        </div>
      </>
    ),
  },
  {
    title: "Reflect",
    desc: "Get a weekly narrative report showing patterns in your life, so you can course-correct before the next week starts.",
    screen: (
      <>
        <div className="text-xs text-zinc-500 font-medium mb-3">
          Weekly Report
        </div>
        <div className="space-y-2.5 flex-1">
          <div className="rounded-xl bg-zinc-700/50 p-3">
            <div className="text-[10px] text-zinc-400 uppercase tracking-wider mb-2">
              Mood this week
            </div>
            <div className="flex items-end gap-1 h-10">
              {[50, 60, 45, 75, 70, 85, 80].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-sm bg-violet-500/60"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>
          <div className="rounded-xl bg-zinc-700/50 p-3">
            <div className="text-[10px] text-zinc-400 uppercase tracking-wider mb-1">
              Pattern
            </div>
            <div className="text-xs text-zinc-300">
              Best mood on days you exercised. Worst on days with meetings after
              6pm.
            </div>
          </div>
          <div className="rounded-xl bg-zinc-700/50 p-3">
            <div className="text-[10px] text-zinc-400 uppercase tracking-wider mb-1">
              Top 3 Actions
            </div>
            <div className="space-y-1 text-xs text-zinc-300">
              <div>1. Block mornings for deep work</div>
              <div>2. No meetings after 5pm</div>
              <div>3. Exercise before noon</div>
            </div>
          </div>
        </div>
      </>
    ),
  },
];

const features = [
  {
    icon: "🎙️",
    title: "Voice-first journaling",
    desc: "No typing, no prompts. Just talk. Record up to 10 minutes of unfiltered thoughts every night.",
  },
  {
    icon: "📋",
    title: "AI task extraction",
    desc: "AI pulls actionable tasks from your ramblings and drops them into a clean to-do list.",
  },
  {
    icon: "🎯",
    title: "Goal tracking",
    desc: "Surface recurring goals across entries and track your progress over time — automatically.",
  },
  {
    icon: "😊",
    title: "Mood analytics",
    desc: "See your emotional arc over days and weeks. Spot trends before they become problems.",
  },
  {
    icon: "📊",
    title: "Weekly insight reports",
    desc: "Every Monday you get a digest: patterns, progress, blockers, and the top 3 actions for the week.",
  },
  {
    icon: "🗺️",
    title: "Life Map",
    desc: "A visual dashboard connecting your goals, moods, and tasks into one coherent picture of your life.",
  },
];

// TODO: Replace these fake testimonials with real user testimonials
const testimonials = [
  {
    name: "Sarah K.",
    role: "Product Manager",
    quote:
      "I used to let tasks pile up in my head until 2 AM. Now I dump everything into Acuity in 60 seconds and actually sleep.",
  },
  {
    name: "Marcus T.",
    role: "Startup Founder",
    quote:
      "The weekly reports are unreal. It's like having a therapist and a project manager rolled into one AI.",
  },
  {
    name: "Priya D.",
    role: "Graduate Student",
    quote:
      "I've tried every journaling app. Acuity is the only one that stuck because it asks nothing of me except my voice.",
  },
];

const pricingFeatures = [
  "Unlimited voice entries",
  "AI task & goal extraction",
  "Mood tracking & analytics",
  "Weekly insight reports",
  "Life Map dashboard",
  "Data export anytime",
];
