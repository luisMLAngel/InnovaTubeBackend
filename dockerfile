# ======================
# Base
# ======================
FROM node:20-alpine AS base
WORKDIR /usr/src/app

COPY package.json package-lock.json ./

# ======================
# Dependencies
# ======================
FROM base AS deps
RUN npm ci

# ======================
# Development
# ======================
FROM deps AS dev
COPY . .
EXPOSE 3000
CMD ["npm", "run", "start:dev"]

# ======================
# Build (production)
# ======================
FROM deps AS build
COPY . .
RUN npm run build
RUN npx prisma generate

# ======================
# Production
# ======================
FROM node:20-alpine AS prod
WORKDIR /usr/src/app

ENV NODE_ENV=production

COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/prisma ./prisma
COPY package.json ./

EXPOSE 3000
CMD ["node", "dist/main.js"]