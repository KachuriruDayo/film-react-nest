FROM node:20-alpine AS builder
WORKDIR /var/www/app
COPY package*.json ./
RUN npm i
COPY . .

ARG VITE_API_URL="http://localhost/api/afisha"
ARG VITE_CDN_URL="http://localhost/content/afisha"

RUN VITE_API_URL=${VITE_API_URL} VITE_CDN_URL=${VITE_CDN_URL} npm run build

FROM nginx:stable-alpine AS production
WORKDIR /var/www/frontend
COPY --from=builder /var/www/app/dist ./

CMD [ "nginx", "-g", "daemon off;" ]