"use client";

import { FormEvent, useState } from "react";
import { StatusBadge } from "@/components/StatusBadge";
import type { Client } from "@/lib/types";

const emptyForm = {
  name: "",
  industry: "",
  contactName: "",
  contactEmail: "",
  status: "onboarding" as Client["status"],
  services: "",
  notes: "",
};

export function ClientsClient({ initial }: { initial: Client[] }) {
  const [clients, setClients] = useState(initial);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  function startEdit(c: Client) {
    setEditingId(c.id);
    setForm({
      name: c.name,
      industry: c.industry,
      contactName: c.contactName,
      contactEmail: c.contactEmail,
      status: c.status,
      services: c.services.join(", "),
      notes: c.notes || "",
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const payload = {
      name: form.name.trim(),
      industry: form.industry.trim() || "General",
      contactName: form.contactName.trim(),
      contactEmail: form.contactEmail.trim(),
      status: form.status,
      services: form.services
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      notes: form.notes.trim() || undefined,
    };
    try {
      if (editingId) {
        const res = await fetch(`/api/clients/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Update failed");
        const updated = (await res.json()) as Client;
        setClients((prev) =>
          prev.map((c) => (c.id === editingId ? updated : c))
        );
      } else {
        const res = await fetch("/api/clients", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Create failed");
        const created = (await res.json()) as Client;
        setClients((prev) => [...prev, created]);
      }
      cancelEdit();
    } catch {
      setError("Could not save client.");
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this client?")) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/clients/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setClients((prev) => prev.filter((c) => c.id !== id));
      if (editingId === id) cancelEdit();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-white">
          Clients
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          CRM lite — Mirabilis, Naturals, 24 Roots, INORBIT, and more.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/40">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-white/10 text-xs uppercase text-zinc-500">
              <tr>
                <th className="px-4 py-3 font-medium">Client</th>
                <th className="px-4 py-3 font-medium">Contact</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Services</th>
                <th className="px-4 py-3 font-medium" />
              </tr>
            </thead>
            <tbody>
              {clients.map((c) => (
                <tr
                  key={c.id}
                  className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]"
                >
                  <td className="px-4 py-3">
                    <div className="font-medium text-zinc-100">{c.name}</div>
                    <div className="text-xs text-zinc-500">{c.industry}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-zinc-300">{c.contactName || "—"}</div>
                    <div className="text-xs text-zinc-500">{c.contactEmail}</div>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={c.status} />
                  </td>
                  <td className="px-4 py-3 text-xs text-zinc-400">
                    {c.services.join(" · ") || "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => startEdit(c)}
                      className="mr-2 text-xs text-cyan-400 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(c.id)}
                      className="text-xs text-rose-400 hover:underline"
                      disabled={busy}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <form
          onSubmit={onSubmit}
          className="h-fit space-y-3 rounded-2xl border border-white/10 bg-zinc-900/40 p-5"
        >
          <h2 className="font-medium text-white">
            {editingId ? "Edit client" : "Add client"}
          </h2>
          {(
            [
              ["name", "Name", "text"],
              ["industry", "Industry", "text"],
              ["contactName", "Contact name", "text"],
              ["contactEmail", "Contact email", "email"],
              ["services", "Services (comma-separated)", "text"],
            ] as const
          ).map(([key, label, type]) => (
            <div key={key}>
              <label className="text-xs text-zinc-500">{label}</label>
              <input
                type={type}
                required={key === "name" || key === "contactEmail"}
                value={form[key]}
                onChange={(e) =>
                  setForm((f) => ({ ...f, [key]: e.target.value }))
                }
                className="mt-1 w-full rounded-lg border border-white/10 bg-zinc-950 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-cyan-500/40"
              />
            </div>
          ))}
          <div>
            <label className="text-xs text-zinc-500">Status</label>
            <select
              value={form.status}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  status: e.target.value as Client["status"],
                }))
              }
              className="mt-1 w-full rounded-lg border border-white/10 bg-zinc-950 px-3 py-2 text-sm text-white"
            >
              <option value="active">active</option>
              <option value="onboarding">onboarding</option>
              <option value="paused">paused</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-zinc-500">Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) =>
                setForm((f) => ({ ...f, notes: e.target.value }))
              }
              rows={3}
              className="mt-1 w-full rounded-lg border border-white/10 bg-zinc-950 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-cyan-500/40"
            />
          </div>
          {error ? <p className="text-sm text-rose-400">{error}</p> : null}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={busy}
              className="rounded-xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-cyan-400 disabled:opacity-50"
            >
              {editingId ? "Save" : "Create"}
            </button>
            {editingId ? (
              <button
                type="button"
                onClick={cancelEdit}
                className="rounded-xl bg-white/5 px-4 py-2 text-sm text-zinc-300 ring-1 ring-white/10"
              >
                Cancel
              </button>
            ) : null}
          </div>
        </form>
      </div>
    </div>
  );
}
