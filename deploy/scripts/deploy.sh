#!/usr/bin/env bash
# Runs on the RHEL server (invoked over SSH by .github/workflows/cd.yml).
# Implements: pull images -> run idle color -> health check -> switch nginx -> stop old color.
#
# Usage: deploy.sh <frontend-image:tag> <backend-image:tag>
#
# Assumes the one-time server prep in docs/CICD_SETUP.md has run:
#   - $NGINX_DIR exists and is owned by the deploy user (so cp/ln need no sudo)
#   - passwordless sudo for exactly: /usr/sbin/nginx -t, /usr/bin/systemctl reload nginx
#   - deploy user is in the docker group

set -euo pipefail

if [ "$#" -ne 2 ]; then
  echo "usage: $0 <frontend-image:tag> <backend-image:tag>" >&2
  exit 2
fi

FRONTEND_IMAGE="$1"
BACKEND_IMAGE="$2"

APP_DIR="${APP_DIR:-/opt/howdz}"
NGINX_SRC="$APP_DIR/nginx"                    # synced from the repo by scp-action
NGINX_DIR="${NGINX_DIR:-/etc/nginx/howdz}"    # what howdz.conf actually includes
STATE_FILE="$APP_DIR/active_color"
SUDO="${SUDO:-sudo}"

mkdir -p "$APP_DIR"

CURRENT="$(cat "$STATE_FILE" 2>/dev/null || echo blue)"
if [ "$CURRENT" = "blue" ]; then TARGET=green; else TARGET=blue; fi

if [ "$TARGET" = "blue" ]; then
  FRONT_PORT=8081
  BACK_PORT=9081
else
  FRONT_PORT=8082
  BACK_PORT=9082
fi

echo "==> Current live color: $CURRENT. Deploying to: $TARGET"

# Publish the upstream definitions from the repo. Previously these were scp'd to
# /opt/howdz/nginx and never read - nginx includes /etc/nginx/howdz - so edits to
# the repo's port mapping silently never reached the server.
echo "==> Installing upstream configs into $NGINX_DIR"
for color in blue green; do
  install -m 0644 "$NGINX_SRC/frontend-$color.conf" "$NGINX_DIR/frontend-$color.conf"
  install -m 0644 "$NGINX_SRC/backend-$color.conf"  "$NGINX_DIR/backend-$color.conf"
done

echo "==> Pulling images"
docker pull "$FRONTEND_IMAGE"
docker pull "$BACKEND_IMAGE"

echo "==> Starting $TARGET containers"
docker rm -f "howdz-frontend-$TARGET" >/dev/null 2>&1 || true
docker rm -f "howdz-backend-$TARGET" >/dev/null 2>&1 || true

docker run -d --name "howdz-frontend-$TARGET" --restart unless-stopped \
  -p "127.0.0.1:${FRONT_PORT}:80" "$FRONTEND_IMAGE"

docker run -d --name "howdz-backend-$TARGET" --restart unless-stopped \
  -p "127.0.0.1:${BACK_PORT}:3000" "$BACKEND_IMAGE"

echo "==> Health checking $TARGET"
healthy=false
for _ in $(seq 1 15); do
  if curl -fs "http://127.0.0.1:${FRONT_PORT}/" >/dev/null \
     && curl -fs "http://127.0.0.1:${BACK_PORT}/health" >/dev/null; then
    healthy=true
    break
  fi
  sleep 2
done

if [ "$healthy" != "true" ]; then
  echo "==> Health check FAILED for $TARGET - rolling back, leaving $CURRENT live"
  docker logs --tail 50 "howdz-frontend-$TARGET" 2>&1 | sed 's/^/    [fe] /' || true
  docker logs --tail 50 "howdz-backend-$TARGET"  2>&1 | sed 's/^/    [be] /' || true
  docker rm -f "howdz-frontend-$TARGET" "howdz-backend-$TARGET" >/dev/null 2>&1 || true
  exit 1
fi

echo "==> Health check passed. Switching nginx traffic to $TARGET"
FRONT_LINK="$NGINX_DIR/active-frontend-upstream.conf"
BACK_LINK="$NGINX_DIR/active-backend-upstream.conf"

# Remember where the symlinks pointed so a failed `nginx -t` can be undone.
PREV_FRONT="$(readlink -f "$FRONT_LINK" 2>/dev/null || echo "$NGINX_DIR/frontend-$CURRENT.conf")"
PREV_BACK="$(readlink -f "$BACK_LINK" 2>/dev/null || echo "$NGINX_DIR/backend-$CURRENT.conf")"

restore_links() {
  ln -sfn "$PREV_FRONT" "$FRONT_LINK"
  ln -sfn "$PREV_BACK" "$BACK_LINK"
}

ln -sfn "$NGINX_DIR/frontend-$TARGET.conf" "$FRONT_LINK"
ln -sfn "$NGINX_DIR/backend-$TARGET.conf" "$BACK_LINK"

if ! $SUDO /usr/sbin/nginx -t; then
  echo "==> nginx config test FAILED - reverting symlinks, leaving $CURRENT live"
  restore_links
  docker rm -f "howdz-frontend-$TARGET" "howdz-backend-$TARGET" >/dev/null 2>&1 || true
  exit 1
fi

if ! $SUDO /usr/bin/systemctl reload nginx; then
  echo "==> nginx reload FAILED - reverting symlinks, leaving $CURRENT live"
  restore_links
  $SUDO /usr/bin/systemctl reload nginx || true
  docker rm -f "howdz-frontend-$TARGET" "howdz-backend-$TARGET" >/dev/null 2>&1 || true
  exit 1
fi

echo "$TARGET" > "$STATE_FILE"

echo "==> Stopping old ($CURRENT) containers"
docker rm -f "howdz-frontend-$CURRENT" "howdz-backend-$CURRENT" >/dev/null 2>&1 || true

echo "==> Pruning dangling images"
docker image prune -f >/dev/null 2>&1 || true

echo "==> Deploy complete. Live color: $TARGET"
