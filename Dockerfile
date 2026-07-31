FROM node:24-alpine AS base

WORKDIR /usr/src/app

FROM base AS deps

COPY package*.json ./

RUN npm ci --omit=dev

FROM base AS builder

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM base AS app

ENV NODE_ENV=production

COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist

COPY package*.json ./
COPY typeorm.config.ts ./

EXPOSE 3000

CMD ["npm", "run", "start:prod"]