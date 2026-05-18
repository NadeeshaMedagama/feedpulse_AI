FROM node:26-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 4001
CMD ["npm", "run", "start:docker"]

