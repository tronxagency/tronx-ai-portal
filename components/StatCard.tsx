export function StatCard({
  label,
  value,
  hint,
  accent = "cyan",
}: {
  label: string;
  value: string | number;
  hint?: string;
  accent?: "cyan" | "rose" | "amber" | "emerald";
}) {
  const accents = {
    cyan: "from-cyan-500/20 to-transparent text-cyan-300",
    rose: "from-rose-500/20 to-transparent text-rose-300",
    amber: "from-amber-500/20 to-transparent text-amber-300",
    emerald: "from-emerald-500/20 to-transparent text-emerald-300",
  };
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/60 p-5 shadow-lg shadow-black/20">
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${accents[accent]} opacity-40`}
      />
      <div className="relative">
        <div className="text-sm text-zinc-400">{label}</div>
        <div className={`mt-2 text-3xl font-semibold tracking-tight ${accents[accent].split(" ").pop()}`}>
          {value}
        </div>
        {hint ? <div className="mt-1 text-xs text-zinc-500">{hint}</div> : null}
      </div>
    </div>
  );
}
