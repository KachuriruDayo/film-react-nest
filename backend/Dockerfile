FROM node:20-alpine AS builder
WORKDIR /var/www/server
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:20-alpine AS production
WORKDIR /var/www/server
COPY --from=builder /var/www/server/package*.json ./
RUN npm install --omit=dev
COPY --from=builder /var/www/server/dist ./dist/
COPY --from=builder /var/www/server/public ./public/
CMD ["node", "./dist/main.js"]