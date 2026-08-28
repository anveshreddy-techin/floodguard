FROM node:20-alpine AS base

WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["npm", "start"]
