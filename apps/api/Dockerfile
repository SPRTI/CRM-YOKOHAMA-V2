FROM node:20-alpine AS base
WORKDIR /app
RUN corepack enable

FROM base AS deps
COPY package.json pnpm-workspace.yaml ./
COPY apps/api/package.json apps/api/package.json
COPY packages/shared/package.json packages/shared/package.json
RUN pnpm install --filter api... --no-frozen-lockfile

FROM deps AS build
COPY . .
RUN pnpm --filter api exec prisma generate --schema=prisma/schema.prisma
RUN pnpm --filter api build

FROM build AS runner
WORKDIR /app
ENV NODE_ENV=production
WORKDIR /app/apps/api
EXPOSE 3011
CMD ["node", "dist/main.js"]