# Frontend image: builds the Vue static site and serves it with nginx.
# Self-hosted mode (base "/", API calls go straight to https://kongfandong.cn)
# is used here instead of the CDN build, since assets are served from this
# container rather than an external CDN.

FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build:docker

FROM nginx:1.27-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY docker/nginx-static.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget -qO- http://127.0.0.1/ || exit 1
