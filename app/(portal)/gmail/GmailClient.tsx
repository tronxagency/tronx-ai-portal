"use client";

import { useMemo, useState } from "react";
import { PriorityBadge } from "@/components/PriorityBadge";
import { StatusBadge } from "@/components/StatusBadge";
import type { Email } from "@/lib/types";

export function GmailClient({ initial }: { initial: Email[] }) {
  const [emails, setEmails] = useState(initial);
  const [selectedId, setSelectedId] = useState(initial[0]?.id || "");
  const [draft, setDraft] = useState(initial[0]?.draftReply || "");
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState<"all" | "open" | "critical">("all");

  const selected = useMemo(
    () => emails.find((e) => e.id === selectedId),
    [emails, selectedId]
  );

  const visible = useMemo(() => {
    return emails.filter((e) => {
      if (filter === "open") return e.status !== "handled";
      if (filter === "critical")
        return e.priority === "critical" && e.status !== "handled";
      return true;
    });
  }, [emails, filter]);

  function select(email: Email) {
    setSelectedId(email.id);
    setDraft(email.draftReply || "");
  }

  async function patch(id: string, body: Partial<Email>) {
    setSaving(true);
    try {
      const res = await fetch(`/api/emails/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Failed");
      const updated = (await res.json()) as Email;
      setEmails((prev) => prev.map((e) => (e.id === id ? updated : e)));
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
            Gmail Triage
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Seeded demo inbox — Panoskin, ElevenLabs, INORBIT, Naturals, Mirabilis.
          </p>
        </div>
        <div className="flex gap-2">
          {(["all", "open", "critical"] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`rounded-lg px-3 py-1.5 text-xs capitalize ring-1 ${
                filter === f
                  ? "bg-cyan-500/15 text-cyan-300 ring-cyan-500/40"
                  : "bg-white/5 text-zinc-400 ring-white/10 hover:text-zinc-200"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid min-h-[560px] gap-4 lg:grid-cols-[340px_1fr]">
        <ul className="space-y-2 overflow-auto rounded-2xl border border-white/10 bg-zinc-900/40 p-2">
          {visible.map((e) => (
            <li key={e.id}>
              <button
                type="button"
                onClick={() => select(e)}
                className={`w-full rounded-xl p-3 text-left transition ${
                  selectedId === e.id
                    ? "bg-cyan-500/10 ring-1 ring-cyan-500/30"
                    : "hover:bg-white/5"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-medium text-zinc-100">
                    {e.fromName}
                  </span>
                  <PriorityBadge priority={e.priority} />
                </div>
                <div className="mt-1 truncate text-sm text-zinc-300">
                  {e.subject}
                </div>
                <div className="mt-1 flex items-center justify-between gap-2">
                  <span className="truncate text-xs text-zinc-500">
                    {e.preview}
                  </span>
                  <StatusBadge status={e.status} />
                </div>
              </button>
            </li>
          ))}
          {visible.length === 0 ? (
            <li className="p-4 text-sm text-zinc-500">No emails in this filter.</li>
          ) : null}
        </ul>

        <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-5">
          {selected ? (
            <div className="flex h-full flex-col">
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-white/10 pb-4">
                <div>
                  <h2 className="text-lg font-medium text-white">
                    {selected.subject}
                  </h2>
                  <p className="mt-1 text-sm text-zinc-400">
                    {selected.fromName} <{selected.from}> · {selected.client}
                  </p>
                  <p className="mt-1 text-xs text-zinc-500">
                    {new Date(selected.receivedAt).toLocaleString("en-IN", {
                      timeZone: "Asia/Calcutta",
                    })}{" "}
                    IST
                  </p>
                </div>
                <div className="flex gap-2">
                  <PriorityBadge priority={selected.priority} />
                  <StatusBadge status={selected.status} />
                </div>
              </div>

              <pre className="mt-4 whitespace-pre-wrap font-sans text-sm leading-relaxed text-zinc-300">
                {selected.body}
              </pre>

              <div className="mt-6 flex-1">
                <label className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                  Draft reply
                </label>
                <textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  rows={6}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-100 outline-none ring-cyan-500/30 focus:ring-2"
                  placeholder="Write a reply draft…"
                />
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() =>
                      patch(selected.id, { draftReply: draft, status: "drafted" })
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
                        status: "handled",
                      })
                    }
                    className="rounded-xl bg-emerald-500/20 px-4 py-2 text-sm font-medium text-emerald-200 ring-1 ring-emerald-500/40 hover:bg-emerald-500/30 disabled:opacity-50"
                  >
                    Mark handled
                  </button>
                  <button
                    type="button"
                    disabled={saving || selected.status === "open"}
                    onClick={() => patch(selected.id, { status: "open" })}
                    className="rounded-xl bg-white/5 px-4 py-2 text-sm text-zinc-300 ring-1 ring-white/10 hover:bg-white/10 disabled:opacity-40"
                  >
                    Reopen
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-zinc-500">Select an email.</p>
          )}
        </div>
      </div>
    </div>
  );
}
