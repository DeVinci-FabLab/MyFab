FROM node:18.13.0

COPY ./package*.json /home/node/MyFab_Front/
WORKDIR /home/node/MyFab_Front/
RUN npm install --omit=dev
COPY . .
CMD ["npm", "run", "start"]