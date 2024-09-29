FROM node:22-alpine3.19

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY . .
RUN npm install -g npm 
RUN npm install 

EXPOSE 3000

CMD ["npm", "run", "dev"]