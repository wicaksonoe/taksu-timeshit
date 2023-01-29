FROM node:18.13.0-alpine
WORKDIR /app
COPY . .
RUN yarn install
RUN yarn build
CMD ["node", "/app/build/bot.js"]