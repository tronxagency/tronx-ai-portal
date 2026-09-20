const map: Record<string, string> = {
  open: "bg-sky-500/15 text-sky-300 ring-sky-500/40",
  drafted: "bg-violet-500/15 text-violet-300 ring-violet-500/40",
  handled: "bg-emerald-500/15 text-emerald-300 ring-emerald-500/40",
  needs_reply: "bg-rose-500/15 text-rose-300 ring-rose-500/40",
  draft: "bg-violet-500/15 text-violet-300 ring-violet-500/40",
  approved: "bg-amber-500/15 text-amber-300 ring-amber-500/40",
  posted: "bg-emerald-500/15 text-emerald-300 ring-emerald-500/40",
  active: "bg-emerald-500/15 text-emerald-300 ring-emerald-500/40",
  onboarding: "bg-sky-500/15 text-sky-300 ring-sky-500/40",
  paused: "bg-zinc-500/15 text-zinc-400 ring-zinc-500/40",
};

export function StatusBadge({ status }: { status: string }) {
  const label = status.replace(/_/g, " ");
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ring-1 ring-inset ${map[status] || map.open}`}
    >
      {label}
    </span>
  );
}
