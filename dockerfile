FROM node:21-alpine3.19

RUN corepack enable

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

EXPOSE 3004

CMD [ "pnpm", "run", "start:dev" ]

