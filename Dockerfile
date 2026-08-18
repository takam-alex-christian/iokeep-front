# IOKEEP frontend — Next.js 15 (App Router) + React 19
# Matches the local dev runtime: Node 24 (v24.18.0).
# Build: next build   Run: next start

# ---------------------------------------------------------------------------
# deps: install dependencies (cached on package*.json changes).
# ---------------------------------------------------------------------------
FROM node:24-alpine AS deps

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# ---------------------------------------------------------------------------
# builder: compile the production bundle.
# ---------------------------------------------------------------------------
FROM node:24-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# BE_PROD_URL is inlined into the production bundle (middleware.ts and
# lib/config.ts) at BUILD time. Default targets the backend service over the
# compose network; override with --build-arg when pointing elsewhere.
ARG BE_PROD_URL=http://backend:4000
ENV BE_PROD_URL=$BE_PROD_URL
ENV NODE_ENV=production

RUN npm run build

# ---------------------------------------------------------------------------
# runner: minimal production image running `next start`.
# ---------------------------------------------------------------------------
FROM node:24-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Re-expose BE_PROD_URL at runtime: next.config.js reads it again when the
# server boots to build the /be/* rewrite destination.
ARG BE_PROD_URL=http://backend:4000
ENV BE_PROD_URL=$BE_PROD_URL

COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

CMD ["npm", "run", "start"]
