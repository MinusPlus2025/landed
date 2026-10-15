FROM node:24-bookworm-slim
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY server.js collaboration-api.js ./
COPY scripts ./scripts
COPY build ./build
COPY deployments/fuji.json deployments/l1.json ./deployments/
COPY public ./public
ENV PORT=3000
EXPOSE 3000
CMD ["node", "server.js"]
