# The build context is `backend/`, so the repo-root .dockerignore does NOT apply
# here. backend/.dockerignore is what keeps node_modules out of this image -
# without it, `COPY . .` drops the host's dev dependencies straight over the top
# of the `--omit=dev` install and Trivy scans every one of them.
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev --ignore-scripts --no-audit --no-fund
COPY . .
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/health || exit 1
CMD ["node", "server.js"]
