FROM naksh-backend:latest AS production

WORKDIR /app
ENV NODE_ENV=production

COPY node_modules ./node_modules
COPY dist ./dist

EXPOSE 5000

CMD ["node", "dist/server.js"]
