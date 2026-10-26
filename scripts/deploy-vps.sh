#!/usr/bin/env bash
# Deploy GoVibe storefront on the VPS (run on the server as root).
# Public site target: https://govibe.inventivelab.bd (Caddy separate).
set -euo pipefail

APP_DIR="${APP_DIR:-/var/www/govibe}"
BRANCH="${BRANCH:-main}"
SERVICE_NAME="${SERVICE_NAME:-govibe-web.service}"

cd "$APP_DIR"
git fetch origin
git reset --hard "origin/${BRANCH}"

# Re-exec so the rest of this deploy uses the script that was just pulled
# (bash keeps running the old file contents otherwise).
if [[ "${GOVIBE_DEPLOY_REEXEC:-}" != "1" ]]; then
  export GOVIBE_DEPLOY_REEXEC=1
  exec bash "$APP_DIR/scripts/deploy-vps.sh"
fi

npm ci
# Build may need more RAM than the running app; this only affects `npm run build`.
export NODE_OPTIONS="${NODE_OPTIONS:---max-old-space-size=2048}"
npm run build

# --- Resource guardrails (memory cap + nightly restart) ---
DROPIN_DIR="/etc/systemd/system/${SERVICE_NAME}.d"
mkdir -p "$DROPIN_DIR"
cp "$APP_DIR/scripts/systemd/govibe-web-memory.conf" "$DROPIN_DIR/memory.conf"
systemctl daemon-reload

# Nightly restart at 03:25 local time — offset from Viable's 03:15.
CRON_FILE="/etc/cron.d/govibe-web-nightly"
cat >"$CRON_FILE" <<CRON
# Restart GoVibe overnight so memory creep does not accumulate.
SHELL=/bin/bash
PATH=/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin
25 3 * * * root /bin/systemctl restart ${SERVICE_NAME}
CRON
chmod 644 "$CRON_FILE"

# Weekly wipe of Next image/data cache (Sunday 03:20), then restart covers it.
CACHE_CRON="/etc/cron.d/govibe-web-cache-wipe"
cat >"$CACHE_CRON" <<CRON
# Clear Next.js on-disk cache weekly to limit disk/memory creep.
SHELL=/bin/bash
PATH=/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin
20 3 * * 0 root /bin/rm -rf ${APP_DIR}/.next/cache && /bin/systemctl restart ${SERVICE_NAME}
CRON
chmod 644 "$CACHE_CRON"

systemctl restart "$SERVICE_NAME"
systemctl --no-pager --full status "$SERVICE_NAME" | head -20

# next start needs a moment after systemd restart
# Port map on this VPS: Viable app :3000, Viable PostgREST :3001,
# GoVibe PostgREST :3002, GoVibe app :3003.
HEALTH_URL="${HEALTH_URL:-http://127.0.0.1:3003/}"
health=000
for _ in 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15; do
  health="$(curl -fsS -o /dev/null -w '%{http_code}' "$HEALTH_URL" || true)"
  if [[ "$health" == "200" ]]; then
    break
  fi
  sleep 2
done
echo "health=${health} url=${HEALTH_URL}"
if [[ "$health" != "200" ]]; then
  echo "Deploy finished but local health check did not return 200." >&2
  exit 1
fi

echo "Deploy complete ($(git rev-parse --short HEAD))."
echo "Memory cap + nightly restart + weekly cache wipe are active."
