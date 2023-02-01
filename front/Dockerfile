FROM node:lts
WORKDIR /my-project
COPY package.json ./
RUN npm i -g next
RUN npm install
COPY . .
RUN next build
ENV NODE_ENV production

EXPOSE 3000
CMD ["npm", "run", "start"]
