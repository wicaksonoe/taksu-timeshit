import { Client, Events, GatewayIntentBits } from 'discord.js';
import * as dotenv from 'dotenv';

dotenv.config({ path: require('find-config')('.env') });
console.log('TOKEN: ', process.env.BOT_TOKEN);

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, (x) => {
  console.log(`Ready! Logged in as ${x.user.tag}`);
});

client.login(process.env.BOT_TOKEN);
