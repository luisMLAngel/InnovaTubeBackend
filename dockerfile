# BUILD

FROM node:20-alpine AS build
WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build
RUN npx prisma generate

# PRODUCTION

FROM node:20-alpine AS prod
WORKDIR /usr/src/app

ENV NODE_ENV=production

COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/prisma ./prisma
COPY package.json ./

EXPOSE 3000
CMD ["node", "dist/src/main.js"]