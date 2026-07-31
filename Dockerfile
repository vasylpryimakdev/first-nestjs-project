FROM node:24-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM node:24-alpine AS production-dependencies

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --omit=dev

FROM node:24-alpine

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/package*.json ./
COPY --from=production-dependencies /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist

ENV NODE_ENV=production

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
