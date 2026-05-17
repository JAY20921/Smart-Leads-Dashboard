FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm config set registry http://registry.npmjs.org/ && npm install --fetch-retries=5

COPY . .
RUN npm run build

# ─── Production stage ─────────────────────────────────────────────────────────
FROM node:20-alpine AS production

WORKDIR /app
ENV NODE_ENV=production

# Only install production dependencies
COPY package*.json ./
RUN npm config set registry http://registry.npmjs.org/ && npm ci --omit=dev --fetch-retries=5

COPY --from=builder /app/dist ./dist

EXPOSE 5000

# Run as non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

CMD ["node", "dist/server.js"]
