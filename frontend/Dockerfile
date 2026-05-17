FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm config set registry http://registry.npmjs.org/ && npm install --fetch-retries=5

COPY . .
RUN npm run build

# ─── Serve with nginx ─────────────────────────────────────────────────────────
FROM nginx:alpine AS production

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
