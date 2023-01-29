docker run --rm -it -v $(pwd):/app -w /app node:18.13.0-alpine /bin/sh

docker build -t discord-taksu-bot .

docker run \
--env BOT_TOKEN= \
--env CLIENT_ID= \
--env PREDEFINED_URL= \
discord-taksu-bot
