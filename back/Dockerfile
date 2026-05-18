FROM node:18.13.0-slim

RUN mkdir -p /home/node/MyFab_Back && chown -R node:node /home/node/MyFab_Back

WORKDIR /home/node/MyFab_Back
USER node

COPY --chown=node:node ./package*.json ./
RUN npm install --omit=dev

COPY --chown=node:node . .

EXPOSE 5000
CMD ["npm", "run", "startOnServer"]
