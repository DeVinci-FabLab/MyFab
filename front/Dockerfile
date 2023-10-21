FROM ubuntu:23.04

RUN apt-get update
RUN apt-get install -y git

ENV NODE_VERSION=18.13.0
RUN apt install -y curl iproute2
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
ENV NVM_DIR=/root/.nvm
RUN . "$NVM_DIR/nvm.sh" && nvm install ${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm use v${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm alias default v${NODE_VERSION}

COPY . /home/node/MyFab_Front/
WORKDIR /home/node/MyFab_Front/
ENV PATH="/root/.nvm/versions/node/v${NODE_VERSION}/bin/:${PATH}"
ENV IS_LINUX=true
ENV ENV_NAME=front

RUN npm install 
RUN npm run build 

CMD ["npm", "run", "start"]
