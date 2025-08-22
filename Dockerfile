FROM node:18

WORKDIR /app

COPY package.json .
RUN npm install

COPY index.js .

EXPOSE 1027

CMD ["npm", "start"]
