FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

ARG VITE_API_PORT
ARG VITE_API_DOMAIN
ENV VITE_API_PORT=${VITE_API_PORT} \
    VITE_API_DOMAIN=${VITE_API_DOMAIN}

RUN npm run build


FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY generate-nginx-conf.sh /docker-entrypoint.d/
RUN chmod +x /docker-entrypoint.d/generate-nginx-conf.sh

EXPOSE ${PORT}

CMD ["sh", "-c", "/docker-entrypoint.d/generate-nginx-conf.sh && nginx -g 'daemon off;'"]