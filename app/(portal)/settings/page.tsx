export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-white">
          Settings
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          Integrations and portal configuration.
        </p>
      </div>

      <section className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6">
        <h2 className="text-lg font-medium text-white">Demo authentication</h2>
        <p className="mt-2 text-sm text-zinc-400">
          This MVP uses a password gate (httpOnly cookie signed with{" "}
          <code className="text-cyan-300">SESSION_SECRET</code>). Credentials
          come from <code className="text-cyan-300">DEMO_PASSWORD</code> and any{" "}
          <code className="text-cyan-300">@tronx.agency</code> email.
        </p>
        <ul className="mt-3 list-inside list-disc text-sm text-zinc-400">
          <li>
            Email: <code className="text-zinc-300">any@tronx.agency</code>
          </li>
          <li>
            Password: env <code className="text-zinc-300">DEMO_PASSWORD</code>
          </li>
        </ul>
      </section>

      <section className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-medium text-white">Gmail OAuth</h2>
          <span className="rounded-full bg-sky-500/15 px-2 py-0.5 text-xs text-sky-300 ring-1 ring-sky-500/40">
            Planned
          </span>
        </div>
        <p className="mt-2 text-sm text-zinc-400">
          To connect a real Gmail inbox later (Google Cloud Console):
        </p>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-zinc-400">
          <li>
            Create a Google Cloud project and enable the{" "}
            <strong className="text-zinc-300">Gmail API</strong>.
          </li>
          <li>
            Configure OAuth consent screen (Internal for Workspace, or External
            + test users).
          </li>
          <li>
            Create OAuth client ID (Web) with redirect URI{" "}
            <code className="text-cyan-300">
              https://&lt;your-domain&gt;/api/auth/google/callback
            </code>
            .
          </li>
          <li>
            Request scopes:{" "}
            <code className="text-zinc-300">gmail.readonly</code>,{" "}
            <code className="text-zinc-300">gmail.compose</code> (or{" "}
            <code className="text-zinc-300">gmail.modify</code>).
          </li>
          <li>
            Store <code className="text-cyan-300">GOOGLE_CLIENT_ID</code>,{" "}
            <code className="text-cyan-300">GOOGLE_CLIENT_SECRET</code>, and
            refresh tokens in env / secret manager — never in the client.
          </li>
          <li>
            Replace the seeded JSON store with live{" "}
            <code className="text-zinc-300">users.messages.list</code> sync and
            draft creation via the Gmail API.
          </li>
        </ol>
        <p className="mt-3 text-xs text-zinc-500">
          Until then, triage uses local seeded data under{" "}
          <code>/data/emails.json</code>.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-dashed border-white/15 bg-zinc-900/30 p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-medium text-white">WhatsApp Business</h2>
            <span className="rounded-full bg-zinc-500/20 px-2 py-0.5 text-xs text-zinc-400 ring-1 ring-zinc-500/40">
              Coming soon
            </span>
          </div>
          <p className="mt-2 text-sm text-zinc-500">
            Meta Cloud API inbox, templates, and client thread routing — roadmap
            item after Gmail OAuth.
          </p>
        </div>
        <div className="rounded-2xl border border-dashed border-white/15 bg-zinc-900/30 p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-medium text-white">Instagram</h2>
            <span className="rounded-full bg-zinc-500/20 px-2 py-0.5 text-xs text-zinc-400 ring-1 ring-zinc-500/40">
              Coming soon
            </span>
          </div>
          <p className="mt-2 text-sm text-zinc-500">
            Instagram Messaging / comments triage for 24 Roots and salon brands.
          </p>
        </div>
      </section>
    </div>
  );
}
