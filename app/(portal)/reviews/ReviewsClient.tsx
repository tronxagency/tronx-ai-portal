"use client";

import { useMemo, useState } from "react";
import { Stars } from "@/components/Stars";
import { StatusBadge } from "@/components/StatusBadge";
import type { Review, ReviewStatus } from "@/lib/types";

const STATUSES: ReviewStatus[] = [
  "needs_reply",
  "draft",
  "approved",
  "posted",
];

export function ReviewsClient({ initial }: { initial: Review[] }) {
  const [reviews, setReviews] = useState(initial);
  const [selectedId, setSelectedId] = useState(initial[0]?.id || "");
  const [draft, setDraft] = useState(initial[0]?.draftReply || "");
  const [clientFilter, setClientFilter] = useState("all");
  const [saving, setSaving] = useState(false);

  const clients = useMemo(
    () => Array.from(new Set(reviews.map((r) => r.client))).sort(),
    [reviews]
  );

  const visible = useMemo(() => {
    if (clientFilter === "all") return reviews;
    return reviews.filter((r) => r.client === clientFilter);
  }, [reviews, clientFilter]);

  const selected = useMemo(
    () => reviews.find((r) => r.id === selectedId),
    [reviews, selectedId]
  );

  function select(r: Review) {
    setSelectedId(r.id);
    setDraft(r.draftReply || r.postedReply || "");
  }

  async function patch(id: string, body: Partial<Review>) {
    setSaving(true);
    try {
      const res = await fetch(`/api/reviews/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Failed");
      const updated = (await res.json()) as Review;
      setReviews((prev) => prev.map((r) => (r.id === id ? updated : r)));
      if (body.draftReply !== undefined) setDraft(updated.draftReply || "");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            Review Workflows
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            GMB / Google replies — draft, approve, post. Seeded Mirabilis &
            Naturals.
          </p>
        </div>
        <select
          value={clientFilter}
          onChange={(e) => setClientFilter(e.target.value)}
          className="rounded-lg border border-white/10 bg-zinc-950 px-3 py-1.5 text-sm text-zinc-200"
        >
          <option value="all">All clients</option>
          {clients.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-3 sm:grid-cols-4">
        {STATUSES.map((s) => {
          const count = reviews.filter((r) => r.status === s).length;
          return (
            <div
              key={s}
              className="rounded-xl border border-white/10 bg-zinc-900/50 px-4 py-3"
            >
              <div className="text-xs capitalize text-zinc-500">
                {s.replace(/_/g, " ")}
              </div>
              <div className="mt-1 text-2xl font-semibold text-white">{count}</div>
            </div>
          );
        })}
      </div>

      <div className="grid min-h-[520px] gap-4 lg:grid-cols-[1fr_1fr]">
        <ul className="space-y-2 overflow-auto rounded-2xl border border-white/10 bg-zinc-900/40 p-2">
          {visible.map((r) => (
            <li key={r.id}>
              <button
                type="button"
                onClick={() => select(r)}
                className={`w-full rounded-xl p-3 text-left transition ${
                  selectedId === r.id
                    ? "bg-cyan-500/10 ring-1 ring-cyan-500/30"
                    : "hover:bg-white/5"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium text-zinc-100">
                    {r.reviewer}
                  </span>
                  <StatusBadge status={r.status} />
                </div>
                <div className="mt-1 flex items-center gap-2 text-xs text-zinc-500">
                  <span>{r.client}</span>
                  <span>·</span>
                  <span>{r.platform}</span>
                  <Stars rating={r.rating} />
                </div>
                <p className="mt-2 line-clamp-2 text-sm text-zinc-400">
                  {r.text || "(No written review)"}
                </p>
              </button>
            </li>
          ))}
        </ul>

        <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-5">
          {selected ? (
            <div className="space-y-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-medium text-white">
                    {selected.reviewer}
                  </h2>
                  <Stars rating={selected.rating} />
                  <StatusBadge status={selected.status} />
                </div>
                <p className="mt-1 text-sm text-zinc-500">
                  {selected.client} · {selected.platform} ·{" "}
                  {new Date(selected.reviewedAt).toLocaleDateString("en-IN", {
                    timeZone: "Asia/Calcutta",
                  })}
                </p>
              </div>
              <blockquote className="rounded-xl border border-white/5 bg-zinc-950/60 p-4 text-sm text-zinc-300">
                {selected.text || "(Star rating only — no written review)"}
              </blockquote>
              <div>
                <label className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                  Reply draft
                </label>
                <textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  rows={7}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-100 outline-none ring-cyan-500/30 focus:ring-2"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={saving}
                  onClick={() =>
                    patch(selected.id, { draftReply: draft, status: "draft" })
                  }
                  className="rounded-xl bg-violet-500/20 px-4 py-2 text-sm font-medium text-violet-200 ring-1 ring-violet-500/40 hover:bg-violet-500/30 disabled:opacity-50"
                >
                  Save draft
                </button>
                <button
                  type="button"
                  disabled={saving}
                  onClick={() =>
                    patch(selected.id, {
                      draftReply: draft,
                      status: "approved",
                    })
                  }
                  className="rounded-xl bg-amber-500/20 px-4 py-2 text-sm font-medium text-amber-200 ring-1 ring-amber-500/40 hover:bg-amber-500/30 disabled:opacity-50"
                >
                  Approve
                </button>
                <button
                  type="button"
                  disabled={saving}
                  onClick={() =>
                    patch(selected.id, { draftReply: draft, status: "posted" })
                  }
                  className="rounded-xl bg-emerald-500/20 px-4 py-2 text-sm font-medium text-emerald-200 ring-1 ring-emerald-500/40 hover:bg-emerald-500/30 disabled:opacity-50"
                >
                  Mark posted
                </button>
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => patch(selected.id, { status: "needs_reply" })}
                  className="rounded-xl bg-white/5 px-4 py-2 text-sm text-zinc-300 ring-1 ring-white/10 hover:bg-white/10 disabled:opacity-50"
                >
                  Reset
                </button>
              </div>
              {selected.postedReply ? (
                <p className="text-xs text-emerald-400/80">
                  Posted: {selected.postedReply.slice(0, 120)}
                  {selected.postedReply.length > 120 ? "…" : ""}
                </p>
              ) : null}
            </div>
          ) : (
            <p className="text-sm text-zinc-500">Select a review.</p>
          )}
        </div>
      </div>
    </div>
  );
}
