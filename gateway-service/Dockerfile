FROM node:12

WORKDIR /app

COPY tsconfig.json ./
COPY package.json ./
COPY ./src ./src

RUN yarn --ignore-optional && yarn compile && \
  rm -rf node_modules/ && yarn --prod --ignore-optional && \
  rm -rf src/ tsconfig.json yarn.lock

CMD node /app/dist/server.js
