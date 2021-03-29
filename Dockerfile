FROM node:latest

WORKDIR /app

RUN apt update && apt upgrade -y

COPY . /app

RUN npm install

RUN node ace migration:run &> log.txt

EXPOSE 5000

ENTRYPOINT [ "node index.js" ]
