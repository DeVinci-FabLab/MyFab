FROM node:20.16.0-alpine
RUN npm install -g npm@10.8.2

WORKDIR /app
COPY ./package*.json ./
RUN npm install
COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "run", "start"]

#FROM ubuntu:23.04

#RUN apt-get update
#RUN apt-get install -y git sudo
#RUN apt install -y curl iproute2

#USER ubuntu
#ENV NODE_VERSION=20.16.0
#RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
#ENV NVM_DIR=/home/ubuntu/.nvm
#RUN . "$NVM_DIR/nvm.sh" && nvm install ${NODE_VERSION}
#RUN . "$NVM_DIR/nvm.sh" && nvm use v${NODE_VERSION}
#RUN . "$NVM_DIR/nvm.sh" && nvm alias default v${NODE_VERSION}
#ENV PATH="/home/ubuntu/.nvm/versions/node/v${NODE_VERSION}/bin/:${PATH}"
#RUN npm install -g npm@10.8.2
#RUN npm install -g yarn

#USER root
#COPY . /home/ubuntu/MyFab_Front/
#RUN chown -R ubuntu /home/ubuntu/MyFab_Front/
#RUN chgrp -R ubuntu /home/ubuntu/MyFab_Front/
#USER ubuntu
#WORKDIR /home/ubuntu/MyFab_Front/

#RUN npm install
#RUN npm run build

#CMD ["npm", "run", "start"]