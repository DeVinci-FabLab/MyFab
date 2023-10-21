FROM node:16.19.0

COPY ./package*.json /home/node/MyFab_Front/
WORKDIR /home/node/MyFab_Front/
RUN npm i -g next
RUN npm install
COPY . .
RUN next build
ENV NODE_ENV=production
CMD ["npm", "run", "start"]
