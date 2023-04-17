FROM node:18-alpine as build-stage

WORKDIR /app

COPY dist /app/dist
RUN ls /app/dist

EXPOSE 3210

CMD ["node", "/app/dist/server.cjs"]
