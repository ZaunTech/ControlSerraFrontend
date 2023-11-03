FROM node:18.0.0

WORKDIR /usr/src/app

COPY package.json .

RUN npm install --quiet --no-optional --no-fund --loglevel=error

COPY . .

RUN npm run build

EXPOSE 5173

CMD [ "npm", "run", "preview" ]