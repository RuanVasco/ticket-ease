FROM node:24-alpine AS builder
WORKDIR /app

ARG VITE_API_BASE_URL
ARG VITE_WS_URL

ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_WS_URL=$VITE_WS_URL

COPY . .
RUN npm install && npm run build

FROM nginx:stable-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
