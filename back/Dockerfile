FROM node:18.13.0

COPY ./package*.json /home/node/MyFab_Back/
WORKDIR /home/node/MyFab_Back/
RUN npm install --omit=dev
COPY . .
CMD ["npm", "run", "startOnServer"]