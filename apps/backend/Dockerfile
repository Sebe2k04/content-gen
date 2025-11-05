FROM node:18-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN npm install -g pnpm

COPY apps/backend apps/contract  
RUN pnpm install

WORKDIR /app/apps/backend
# RUN pnpm run build

EXPOSE ${PORT}

CMD ["pnpm", "dev"]
