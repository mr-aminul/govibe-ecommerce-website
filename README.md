# GoVibe — E‑commerce Website

Next.js storefront + Admin/Manager ops for **GoVibe** (men’s bags & everyday carries, Dhaka).

## Stack

- **App:** Next.js 15 (App Router) + TypeScript + Tailwind v4 + Framer Motion
- **Host:** VPS (Caddy + systemd Next.js)
- **DB / API:** GoVibe Postgres via dedicated PostgREST (`/govibe-rest`) — isolated from Viable
- **Media:** MinIO buckets `govibe-product-images`, `govibe-product-videos`, `govibe-site-media` on `s3.storage.inventivelab.bd`
- **Admin backup:** `/admin/backup` downloads DB + media zip (admin only)

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Copy env and fill GoVibe API / media keys:

```bash
cp .env.example .env.local
```

3. Apply SQL migrations against **VPS Postgres** (SSH tunnel / `DATABASE_URL`), in order under `migrations/`.

4. Create a staff user in `profiles` (password hash via your auth bootstrap), then promote to admin if needed:

```sql
update public.profiles
set role = 'admin', full_name = 'Owner'
where email = 'you@example.com';
```

5. Start the app:

```bash
npm run dev
```

- Storefront: http://localhost:3000  
- Staff login: http://localhost:3000/admin/login  

Scripts set `NODE_EXTRA_CA_CERTS=./certs/forward-trust-root.pem` for local TLS inspection when needed.

## Deploy (VPS)

Production: **https://govibe.inventivelab.bd**

On the server (`/var/www/govibe`):

```bash
sudo bash scripts/deploy-vps.sh
```

That pulls `main`, builds, and restarts `govibe-web.service`. It also applies a memory cap, a **nightly restart** (03:25), and a **weekly** `.next/cache` wipe. Caddy terminates HTTPS and reverse-proxies to `127.0.0.1:3003`. Production secrets live in `/var/www/govibe/.env.local` (not in git).

## Isolation vs Viable

| Concern | GoVibe | Viable |
|--------|--------|--------|
| PostgREST | `:3002` + `/govibe-rest` | `:3001` + `/viable-rest` |
| API key header | `X-GoVibe-Key` | `X-Viable-Key` |
| DB | `postgres` + role `govibe_app` | `viable` + role `viable_app` |
| Media buckets | `govibe-*` | `product-images`, `site-media`, … |
| Staff cookie | `govibe_staff_session` | `viable_staff_session` |
| App path | `/var/www/govibe` | `/var/www/viable` |
| App port | `:3003` | `:3000` |

## Integrations

Configure under **Admin → Integrations** (preferred over env):

- **Pathao** — delivery cities / zones / quotes / consignments
- **bKash / Nagad** — optional prepaid; leave blank for COD-only
- GTM / Meta Pixel / OMS webhook

## Branding

- Mono black/white theme
- Defaults in `src/lib/brand.ts` + `src/lib/website/defaults.ts`
