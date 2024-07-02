FROM node:20.15.0-alpine as build-stage

WORKDIR /app

COPY dist /app/dist
RUN ls /app/dist

EXPOSE 3210

CMD ["node", "/app/dist/server.cjs"]
