#!/usr/bin/env bash
# Runs on the RHEL server (invoked over SSH by .github/workflows/cd.yml).
# Implements: pull images -> run idle color -> health check -> switch nginx -> stop old color.
#
# Usage: deploy.sh <frontend-image:tag> <backend-image:tag>

set -euo pipefail

FRONTEND_IMAGE="$1"
BACKEND_IMAGE="$2"

APP_DIR=/opt/howdz
NGINX_DIR=/etc/nginx/howdz
STATE_FILE="$APP_DIR/active_color"

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

echo "==> Pulling latest images"
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
  docker rm -f "howdz-frontend-$TARGET" "howdz-backend-$TARGET" >/dev/null 2>&1 || true
  exit 1
fi

echo "==> Health check passed. Switching nginx traffic to $TARGET"
ln -sfn "$NGINX_DIR/frontend-$TARGET.conf" "$NGINX_DIR/active-frontend-upstream.conf"
ln -sfn "$NGINX_DIR/backend-$TARGET.conf" "$NGINX_DIR/active-backend-upstream.conf"
sudo nginx -t
sudo systemctl reload nginx

echo "$TARGET" > "$STATE_FILE"

echo "==> Stopping old ($CURRENT) containers"
docker rm -f "howdz-frontend-$CURRENT" "howdz-backend-$CURRENT" >/dev/null 2>&1 || true

echo "==> Deploy complete. Live color: $TARGET"
