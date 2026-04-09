import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { getAuthOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const session = await getServerSession(getAuthOptions());
  if (session) redirect("/dashboard");

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* ───── HERO ───── */}
      <section className="relative overflow-hidden px-6 pt-32 pb-24 sm:pt-40 sm:pb-32">
        {/* Background glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
        >
          <div className="absolute left-1/2 top-0 -translate-x-1/2 h-[600px] w-[900px] rounded-full bg-brand-600/20 blur-[128px]" />
        </div>

        <div className="mx-auto max-w-3xl text-center animate-fade-in">
          {/* Logo mark */}
          <div className="mx-auto mb-10 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 to-indigo-600 shadow-2xl shadow-brand-900/50">
            <span className="text-3xl">✦</span>
          </div>

          <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl">
            Brain dump daily.
            <br />
            <span className="bg-gradient-to-r from-brand-400 to-indigo-400 bg-clip-text text-transparent">
              Get your life back.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg text-zinc-400 leading-relaxed sm:text-xl">
            Speak for 60 seconds. AI extracts your tasks, goals, mood, and
            weekly insights&nbsp;&mdash; automatically.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/auth/signin"
              className="rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-900/40 transition hover:opacity-90 active:scale-95"
            >
              Start Free Trial
            </Link>
            <a
              href="#how-it-works"
              className="rounded-xl border border-zinc-700 px-8 py-3.5 text-sm font-semibold text-zinc-300 transition hover:border-zinc-500 hover:text-zinc-100"
            >
              See how it works
            </a>
          </div>
        </div>
      </section>

      {/* ───── HOW IT WORKS ───── */}
      <section id="how-it-works" className="px-6 py-24 sm:py-32">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
            How it works
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-center text-zinc-400">
            Three steps. Sixty seconds. Zero effort.
          </p>

          <div className="mt-16 grid gap-8 sm:grid-cols-3">
            {steps.map((s, i) => (
              <div
                key={s.title}
                className="relative rounded-2xl border border-zinc-800 bg-zinc-900/60 p-8 backdrop-blur"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-brand-600/20 text-sm font-bold text-brand-400">
                  {i + 1}
                </div>
                <h3 className="mb-2 text-lg font-semibold">{s.title}</h3>
                <p className="text-sm leading-relaxed text-zinc-400">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── FEATURES GRID ───── */}
      <section className="px-6 py-24 sm:py-32 bg-zinc-900/40">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need to stay sharp
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-center text-zinc-400">
            One nightly habit that powers your entire week.
          </p>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 backdrop-blur"
              >
                <div className="mb-3 text-2xl">{f.icon}</div>
                <h3 className="mb-1.5 font-semibold">{f.title}</h3>
                <p className="text-sm leading-relaxed text-zinc-400">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── SOCIAL PROOF ───── */}
      {/* TODO: Replace fake testimonials with real ones */}
      <section className="px-6 py-24 sm:py-32">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
            People are loving&nbsp;it
          </h2>

          <div className="mt-16 grid gap-8 sm:grid-cols-3">
            {testimonials.map((t) => (
              <figure
                key={t.name}
                className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 backdrop-blur"
              >
                <blockquote className="text-sm leading-relaxed text-zinc-300">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-4 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600/20 text-sm font-bold text-brand-400">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="text-sm font-medium">{t.name}</div>
                    <div className="text-xs text-zinc-500">{t.role}</div>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ───── PRICING ───── */}
      <section className="px-6 py-24 sm:py-32 bg-zinc-900/40">
        <div className="mx-auto max-w-md text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Simple pricing
          </h2>
          <p className="mt-4 text-zinc-400">
            One plan. Everything included. Cancel anytime.
          </p>

          <div className="mt-12 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-8 backdrop-blur">
            <p className="text-sm font-medium uppercase tracking-wider text-brand-400">
              Pro
            </p>
            <p className="mt-4 flex items-baseline justify-center gap-1">
              <span className="text-5xl font-extrabold">$19</span>
              <span className="text-zinc-400">/month</span>
            </p>
            <p className="mt-2 text-sm text-zinc-500">
              7-day free trial &middot; no card required
            </p>

            <ul className="mt-8 space-y-3 text-left text-sm text-zinc-300">
              {pricingFeatures.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <svg
                    className="mt-0.5 h-4 w-4 shrink-0 text-brand-400"
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
              className="mt-8 block w-full rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-900/40 transition hover:opacity-90 active:scale-95"
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      </section>

      {/* ───── FOOTER ───── */}
      <footer className="border-t border-zinc-800 px-6 py-12">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-6 text-sm text-zinc-500">
            <a href="#" className="transition hover:text-zinc-300">
              Terms
            </a>
            <a href="#" className="transition hover:text-zinc-300">
              Privacy
            </a>
            <a href="#" className="transition hover:text-zinc-300">
              Contact
            </a>
          </div>

          <p className="text-xs text-zinc-600">
            Built with{" "}
            <span className="text-brand-400 font-medium">Claude</span>
          </p>
        </div>
      </footer>
    </main>
  );
}

/* ── Data ── */

const steps = [
  {
    title: "Record",
    desc: "Hit record. Speak freely for 60 seconds about your day, your worries, your wins — whatever comes to mind.",
  },
  {
    title: "Extract",
    desc: "AI transcribes and extracts tasks, goals, mood, themes, and insights from your stream of consciousness.",
  },
  {
    title: "Reflect",
    desc: "Get a weekly narrative report showing patterns in your life, so you can course-correct before the next week starts.",
  },
];

const features = [
  {
    icon: "🎙️",
    title: "Voice-first journaling",
    desc: "No typing, no prompts. Just talk. Record up to 10 minutes of unfiltered thoughts every night.",
  },
  {
    icon: "✅",
    title: "AI task extraction",
    desc: "Claude pulls actionable tasks from your ramblings and drops them into a clean to-do list.",
  },
  {
    icon: "🎯",
    title: "Goal tracking",
    desc: "Surface recurring goals across entries and track your progress over time — automatically.",
  },
  {
    icon: "💜",
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
