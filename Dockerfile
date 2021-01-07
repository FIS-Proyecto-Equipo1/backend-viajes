FROM node:9-alpine

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY index.js .
<<<<<<< HEAD
COPY db.js .
COPY server.js .
COPY travels.js .
=======
COPY travels.js .
COPY db.js .
COPY server.js .
>>>>>>> 8a5714d43f9be361364f1ae6651537e3357a1ff2

EXPOSE 4000

CMD npm start