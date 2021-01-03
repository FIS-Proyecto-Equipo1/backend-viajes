FROM node:9-alpine

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY index.js .
COPY db.js .
COPY server.js .
COPY travels.js .

EXPOSE 4000

CMD npm start