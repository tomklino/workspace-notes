FROM node:22-bookworm-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . ./
RUN npm run build

FROM node:22-bookworm-slim
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /app/.output/ ./
RUN chown -R 991:991 /app
USER 991:991
EXPOSE 3000
CMD ["node", "server/index.mjs"]
