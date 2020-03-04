FROM node:12.13.1-alpine
COPY . /opt/rest-ember-gateway
WORKDIR /opt/rest-ember-gateway
EXPOSE 80/tcp 
EXPOSE 80/udp
CMD ["yarn", "start"]