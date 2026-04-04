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
RUN pnpm --filter api prisma generate
RUN pnpm --filter api build

FROM node:20-alpine AS runner
WORKDIR /app
RUN corepack enable
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/apps/api/dist ./apps/api/dist
COPY --from=build /app/apps/api/prisma ./apps/api/prisma
COPY --from=build /app/apps/api/package.json ./apps/api/package.json
COPY --from=build /app/packages/shared ./packages/shared
ENV NODE_ENV=production
WORKDIR /app/apps/api
EXPOSE 3011
CMD ["node", "dist/main.js"]
