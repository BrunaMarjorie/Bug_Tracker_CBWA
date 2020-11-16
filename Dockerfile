FROM node:latest
WORKDIR /src
COPY ./src ./src
COPY package.json ./
RUN npm install
EXPOSE 3000
ENTRYPOINT [ "npm", "run", "start" ]