FROM node:18-alpine AS builder
WORKDIR /app
ENV CI=true
COPY package.json yarn.lock ./
RUN corepack enable && yarn set version classic && yarn install --frozen-lockfile --ignore-scripts
COPY . .
RUN yarn build
RUN node dist/utils/db.js

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY package.json yarn.lock ./
RUN corepack enable && yarn set version classic && yarn install --frozen-lockfile --production --ignore-scripts
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/client ./client
EXPOSE 3333
CMD ["node", "--require", "dotenv/config", "dist/index.js"]