import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

export default async function LandingPage() {
  const session = await getSession();
  if (session) redirect("/dashboard");

  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden">
      <div className="pointer-events-none absolute inset-0 tronx-grid opacity-60" />
      <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-violet-600/20 blur-3xl" />

      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <div className="text-xl font-semibold tracking-tight">
          TronX <span className="text-cyan-400">AI</span>
        </div>
        <Link
          href="/login"
          className="rounded-full bg-white/5 px-4 py-2 text-sm text-zinc-200 ring-1 ring-white/10 transition hover:bg-white/10"
        >
          Sign in
        </Link>
      </header>

      <section className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-6 pb-24 pt-10">
        <p className="mb-4 inline-flex w-fit items-center gap-2 rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-300 ring-1 ring-cyan-500/30">
          Private ops portal · TronX Agency
        </p>
        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
          Run Gmail triage, GMB replies, and client ops in one dark cockpit.
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-zinc-400">
          Demo-ready MVP for agency operators — seeded with Mirabilis reviews,
          Naturals reply workflows, vendor payment alerts, and INORBIT billing.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/login"
            className="rounded-xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-zinc-950 shadow-lg shadow-cyan-500/25 transition hover:bg-cyan-400"
          >
            Enter portal
          </Link>
          <a
            href="#modules"
            className="rounded-xl bg-white/5 px-5 py-3 text-sm font-medium text-zinc-200 ring-1 ring-white/10 transition hover:bg-white/10"
          >
            See modules
          </a>
        </div>

        <div id="modules" className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "Gmail Triage",
              desc: "Priority badges, draft replies, mark handled.",
            },
            {
              title: "Review Workflows",
              desc: "Draft → approve → post for GMB / Google.",
            },
            {
              title: "Clients CRUD",
              desc: "Mirabilis, Naturals, 24 Roots, INORBIT…",
            },
            {
              title: "Settings",
              desc: "Gmail OAuth guide · WhatsApp / IG soon.",
            },
          ].map((m) => (
            <div
              key={m.title}
              className="rounded-2xl border border-white/10 bg-zinc-900/50 p-5 backdrop-blur"
            >
              <h3 className="font-medium text-white">{m.title}</h3>
              <p className="mt-2 text-sm text-zinc-400">{m.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/5 px-6 py-6 text-center text-xs text-zinc-600">
        © {new Date().getFullYear()} TronX Agency · Demo auth only — not for production secrets
      </footer>
    </main>
  );
}
