FROM naksh-frontend:latest AS production

WORKDIR /app
COPY dist ./build
COPY docker-server.mjs ./docker-server.mjs

EXPOSE 3000

CMD ["node", "docker-server.mjs"]
