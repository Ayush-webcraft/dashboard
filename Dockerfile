# Frontend image: builds the Vue static site and serves it with nginx.
# Self-hosted mode (base "/", API calls go straight to https://kongfandong.cn)
# is used here instead of the CDN build, since assets are served from this
# container rather than an external CDN.

# node:20 is EOL (2026-04-30) and no longer receives CVE fixes - Trivy's
# CRITICAL/HIGH gate in ci.yml will eventually (and correctly) reject it.
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
# --ignore-scripts skips the `prepare` husky hook, which has no business running
# in a container with no .git. Verified: vite build works without postinstall.
RUN npm ci --ignore-scripts --no-audit --no-fund
COPY . .
RUN npm run build:docker

# nginx 1.27 is off the current stable line; 1.30.x carries the fixes for
# CVE-2026-42945 ("NGINX Rift") among others.
FROM nginx:1.30-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY docker/nginx-static.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget -qO- http://127.0.0.1/ || exit 1
