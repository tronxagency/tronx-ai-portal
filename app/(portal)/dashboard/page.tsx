import Link from "next/link";
import { StatCard } from "@/components/StatCard";
import { PriorityBadge } from "@/components/PriorityBadge";
import { StatusBadge } from "@/components/StatusBadge";
import { Stars } from "@/components/Stars";
import { getDashboardStats } from "@/lib/store";

export default async function DashboardPage() {
  const stats = await getDashboardStats();
  const recentEmails = stats.emails
    .filter((e) => e.status !== "handled")
    .sort(
      (a, b) =>
        new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime()
    )
    .slice(0, 4);
  const pendingReviews = stats.reviews
    .filter((r) => r.status === "needs_reply" || r.status === "draft")
    .slice(0, 4);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-white">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          Ops snapshot for TronX Agency — payments, reviews, and clients.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Open emails"
          value={stats.openEmails}
          hint="Inbox items needing action"
          accent="cyan"
        />
        <StatCard
          label="Critical"
          value={stats.criticalEmails}
          hint="Panoskin / ElevenLabs style alerts"
          accent="rose"
        />
        <StatCard
          label="Reviews in queue"
          value={stats.reviewsNeedingAction}
          hint="Needs reply or draft"
          accent="amber"
        />
        <StatCard
          label="Active clients"
          value={stats.activeClients}
          hint={`${stats.clients.length} total in CRM`}
          accent="emerald"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-white/10 bg-zinc-900/50 p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-medium text-white">Priority inbox</h2>
            <Link href="/gmail" className="text-xs text-cyan-400 hover:underline">
              Open triage →
            </Link>
          </div>
          <ul className="space-y-3">
            {recentEmails.map((e) => (
              <li
                key={e.id}
                className="rounded-xl border border-white/5 bg-zinc-950/50 p-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium text-zinc-100">
                      {e.subject}
                    </div>
                    <div className="mt-0.5 truncate text-xs text-zinc-500">
                      {e.fromName} · {e.client}
                    </div>
                  </div>
                  <PriorityBadge priority={e.priority} />
                </div>
              </li>
            ))}
            {recentEmails.length === 0 ? (
              <li className="text-sm text-zinc-500">All clear.</li>
            ) : null}
          </ul>
        </section>

        <section className="rounded-2xl border border-white/10 bg-zinc-900/50 p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-medium text-white">Review queue</h2>
            <Link
              href="/reviews"
              className="text-xs text-cyan-400 hover:underline"
            >
              Workflows →
            </Link>
          </div>
          <ul className="space-y-3">
            {pendingReviews.map((r) => (
              <li
                key={r.id}
                className="rounded-xl border border-white/5 bg-zinc-950/50 p-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-sm font-medium text-zinc-100">
                      {r.reviewer}
                      <Stars rating={r.rating} />
                    </div>
                    <div className="mt-0.5 truncate text-xs text-zinc-500">
                      {r.client} · {r.platform}
                    </div>
                  </div>
                  <StatusBadge status={r.status} />
                </div>
              </li>
            ))}
            {pendingReviews.length === 0 ? (
              <li className="text-sm text-zinc-500">Queue empty.</li>
            ) : null}
          </ul>
        </section>
      </div>
    </div>
  );
}
