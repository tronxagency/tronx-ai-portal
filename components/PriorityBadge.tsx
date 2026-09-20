import type { Priority } from "@/lib/types";

const styles: Record<Priority, string> = {
  critical: "bg-rose-500/15 text-rose-300 ring-rose-500/40",
  high: "bg-amber-500/15 text-amber-300 ring-amber-500/40",
  medium: "bg-sky-500/15 text-sky-300 ring-sky-500/40",
  low: "bg-zinc-500/15 text-zinc-400 ring-zinc-500/40",
};

export function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ring-1 ring-inset ${styles[priority]}`}
    >
      {priority}
    </span>
  );
}
