# ---- Builder stage ---------------------------------------------------------
FROM node:20-alpine AS builder
WORKDIR /app

# BE_PROD_URL must be available at BUILD time: next.config.js bakes the
# /be/* rewrite destination into the build output when NODE_ENV=production.
ARG BE_PROD_URL
ENV BE_PROD_URL=${BE_PROD_URL}

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# next.config.js reads NODE_ENV=production to pick BE_PROD_URL for the rewrite.
RUN NODE_ENV=production npm run build

# ---- Runner stage ----------------------------------------------------------
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Also needed at RUNTIME: middleware.ts fetches `${BE_PROD_URL}/auth/refresh_token`.
ARG BE_PROD_URL
ENV BE_PROD_URL=${BE_PROD_URL}

COPY package.json package-lock.json ./
# next is a production dependency, so `next start` works after --omit=dev.
RUN npm ci --omit=dev

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./next.config.js

EXPOSE 3000

CMD ["node_modules/.bin/next", "start"]
