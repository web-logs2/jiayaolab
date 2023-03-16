FROM node:18-alpine

RUN apk add tzdata && cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime \
&& echo Asia/Shanghai > /etc/timezone  \
&& apk add ca-certificates

WORKDIR /app

COPY package*.json /app/

RUN npm config set registry https://mirrors.cloud.tencent.com/npm/

RUN npm install -g pnpm && pnpm install

COPY . /app

CMD ["npm", "start"]
