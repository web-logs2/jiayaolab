FROM node:18

WORKDIR /usr/src/app

COPY ./ ./

RUN npm install -g pnpm

RUN pnpm install

RUN npm install pm2 -g

CMD [ "pm2-runtime", "npm", "--", "start" ]