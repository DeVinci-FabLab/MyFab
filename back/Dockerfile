FROM node

COPY ./package*.json /home/node/MyFabUltimate_Back/
WORKDIR /home/node/MyFabUltimate_Back/
RUN npm install
COPY . .
RUN npm run prepareFolders
CMD ["npm", "run", "startOnServer"]
