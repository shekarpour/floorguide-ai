FROM node:22-slim AS builder

WORKDIR /frontend
RUN corepack enable

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

ENV NITRO_PRESET=node-server \
    VITE_API_BASE_URL=https://floorguide-qa-endpoint.fly.dev \
    VITE_USE_MOCK_API=false

RUN pnpm run build

FROM node:22-slim AS runtime

ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=8080

WORKDIR /frontend
COPY --from=builder /frontend/.output ./.output

EXPOSE 8080
CMD ["node", ".output/server/index.mjs"]
