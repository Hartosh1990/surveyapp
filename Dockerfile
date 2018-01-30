FROM node:8.9
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
CMD node MongoConnect.js
EXPOSE 8081
