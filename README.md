#### [#](#dev) Start development without install nodejs {#dev}

```bash
-- on linux / mac --
$ docker run --rm -it -v $(pwd):/app -w /app node:18.13.0-alpine /bin/sh

-- on windows --
$ docker run --rm -it -v YOUR_ABSOLUTE_DIR:/app -w /app node:18.13.0-alpine /bin/sh
```

#### [#](#build) Build the bot {#build}

```bash
$ docker build -t discord-taksu-bot .
```

#### [#](#run) Run the bot {#run}

```bash
$ docker run \
--env BOT_TOKEN= \
--env CLIENT_ID= \
--env PREDEFINED_URL= \
discord-taksu-bot
```

#### [#](#env) Required env {#env}

| Variables      | Description                                                                                                      |
| -------------- | ---------------------------------------------------------------------------------------------------------------- |
| BOT_TOKEN      | Bot token. Get it from [Discord developer page](https://discord.com/developers) or create a new Bot there.       |
| CLIENT_ID      | Client ID / Application ID of the bot app. Get it from [Discord developer page](https://discord.com/developers). |
| PREDEFINED_URL | Prefix URL that will be concatenated with the user data                                                          |
