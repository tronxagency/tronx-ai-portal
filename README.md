# TronX AI Portal

Private ops portal MVP for **TronX Agency** — Gmail triage, Google/GMB review workflows, and client CRM — built with **Next.js (App Router)**, **TypeScript**, and **Tailwind CSS**.

Demo auth only (no Clerk / Auth0): email gate + httpOnly cookie signed with `SESSION_SECRET`.

## Features

1. **Landing** — branded TronX AI marketing shell  
2. **Demo login** — `any@tronx.agency` + `DEMO_PASSWORD`  
3. **Dashboard** — open emails, critical alerts, review queue, active clients  
4. **Gmail triage** — seeded inbox (Panoskin / ElevenLabs payments, INORBIT invoice, Naturals, Mirabilis, 24 Roots); priority badges; draft reply; mark handled  
5. **Review workflows** — seeded GMB/Google reviews; statuses: needs reply → draft → approved → posted  
6. **Clients CRUD** — create / edit / delete  
7. **Settings** — Gmail OAuth setup notes; WhatsApp & Instagram “Coming soon”

Data is seeded under `data/*.json` and persisted to `data/*.runtime.json` when the filesystem is writable (local). On read-only hosts (e.g. Vercel serverless) updates stay in-memory for the instance lifetime.

## Quick start

```bash
cd tronx-ai-portal
cp .env.example .env.local
# edit SESSION_SECRET and DEMO_PASSWORD if desired
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Default demo credentials

| Field    | Value              |
|----------|--------------------|
| Email    | `any@tronx.agency` |
| Password | `tronx-demo-2026`  |

Any `*@tronx.agency` address works with the demo password.

## Environment

See `.env.example`:

| Variable         | Description                                      |
|------------------|--------------------------------------------------|
| `DEMO_EMAIL`     | Hint email (domain `@tronx.agency` is accepted) |
| `DEMO_PASSWORD`  | Password for the demo gate                       |
| `SESSION_SECRET` | HMAC secret for the session cookie               |
| `SESSION_MAX_AGE`| Optional cookie TTL in seconds (default 7d)      |

## Scripts

```bash
npm run dev      # development
npm run build    # production build
npm run start    # serve build
npm run lint     # ESLint
```

## Deploy to Vercel

1. Push this repo (or import the folder) to Vercel.  
2. Set env vars: `DEMO_PASSWORD`, `SESSION_SECRET` (strong random), optional `DEMO_EMAIL`.  
3. Deploy. Middleware protects `/dashboard`, `/gmail`, `/reviews`, `/clients`, `/settings`, and related APIs.

> **Note:** JSON file writes are best-effort on serverless. For production persistence, swap `lib/store.ts` for Postgres / KV / Turso.

## Project layout

```
app/
  page.tsx                 # Landing
  login/                   # Demo login
  (portal)/                # Authenticated shell
    dashboard|gmail|reviews|clients|settings
  api/auth|emails|reviews|clients
components/                # UI primitives
lib/auth.ts store.ts types.ts
data/                      # Seed JSON
middleware.ts              # Session gate
```

## Roadmap

- [ ] Real Gmail OAuth + sync (see Settings)  
- [ ] WhatsApp Business Cloud API inbox  
- [ ] Instagram comments / DMs  
- [ ] Durable DB (Postgres / Turso) instead of JSON  
- [ ] Role-based access (admin / operator / client viewer)  
- [ ] AI draft assist for reviews & email replies  

## License

Private — TronX Agency. Demo seed data is illustrative.
