#Base Image
FROM node:alpine as base
WORKDIR /opt
COPY package*.json ./
RUN npm ci\
  && npm cache clean --force

#Build stage
FROM base as build
ENV PATH=/opt/node_modules/.bin:$PATH
WORKDIR /opt/app
COPY . .
RUN npm install
RUN npm run build

#Development Stage
FROM base as dev
RUN apk add --no-cache tini
WORKDIR /opt
COPY package*.json ./
RUN npm install --development
WORKDIR /opt/app
COPY . .
ENV POSTGRES_ADDRESS=192.168.1.36
ENV POSTGRES_PORT=5432
ENV RABBITMQ_URL=amqp://rabbitmq-srv
ENV RABBITMQ_PORT=5672
ENTRYPOINT [ "/sbin/tini", "--" ]
CMD ["npm", "run", "dev"]

#Production Stage
FROM base as prod
RUN apk add --no-cache tini
WORKDIR /opt/app
COPY . .
EXPOSE 4000
ENTRYPOINT [ "/sbin/tini", "--" ]
COPY --from=build /opt/app/build build/
CMD ["node", "./build/index.js"]
