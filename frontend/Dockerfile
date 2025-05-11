FROM node:20-alpine AS builder
WORKDIR /var/www/app
COPY package*.json ./
RUN npm i
COPY . .
RUN npm run build

FROM node:20-alpine AS production
WORKDIR /var/www/app
COPY --from=builder /var/www/app/package*.json ./
RUN npm install --omit=dev
COPY --from=builder /var/www/app/dist ./dist/