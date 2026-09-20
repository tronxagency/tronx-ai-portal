"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: "◈" },
  { href: "/gmail", label: "Gmail Triage", icon: "✉" },
  { href: "/reviews", label: "Review Workflows", icon: "★" },
  { href: "/clients", label: "Clients", icon: "◎" },
  { href: "/settings", label: "Settings", icon: "⚙" },
];

export function Sidebar({ email }: { email?: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-white/10 bg-zinc-950/80">
      <div className="border-b border-white/10 px-5 py-5">
        <Link href="/dashboard" className="group block">
          <div className="text-lg font-semibold tracking-tight text-white">
            TronX <span className="text-cyan-400">AI</span>
          </div>
          <div className="text-xs text-zinc-500 group-hover:text-zinc-400">
            Ops Portal
          </div>
        </Link>
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-3">
        {nav.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                active
                  ? "bg-cyan-500/10 text-cyan-300 ring-1 ring-cyan-500/30"
                  : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
              }`}
            >
              <span className="w-4 text-center opacity-70">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-white/10 p-4">
        <div className="truncate text-xs text-zinc-500">{email || "Operator"}</div>
        <button
          type="button"
          onClick={logout}
          className="mt-2 text-xs text-zinc-400 underline-offset-2 hover:text-zinc-200 hover:underline"
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}
