FROM node:16.9

WORKDIR /usr/src/app
COPY package.json .
RUN npm install
COPY . .

# fixed cache permission issue on linux
RUN mkdir -p node_modules/.cache && chmod -R 777 node_modules/.cache
