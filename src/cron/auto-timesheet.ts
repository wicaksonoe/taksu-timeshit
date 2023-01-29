import { Client, Events, GatewayIntentBits } from 'discord.js';
import * as dotenv from 'dotenv';
import { exit } from 'process';
import { Model, Sequelize } from 'sequelize';
import Users, { UserSchema } from '../models/users';
import { GenerateTimeSheetUrl } from '../utils/generator';

dotenv.config({ path: require('find-config')('.env') });
console.log('TOKEN: ', process.env.BOT_TOKEN);

// initialize client
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.login(process.env.BOT_TOKEN);

// initialize db
const db = new Sequelize({ dialect: 'sqlite', storage: 'database.sqlite' });

try {
  db.authenticate();
  console.log('Connection to the database established successfully.');
} catch (error) {
  console.log('Unable to connect to the database: ', error);
}

client.once(Events.ClientReady, async (client) => {
  const userModel = Users(db);
  userModel.sync();

  console.log(`Ready! Logged in as ${client.user.tag}`);

  // run cron job
  const guildIds = await userModel.findAll({
    attributes: ['guild_id'],
    group: 'guild_id'
  });

  for (let i = 0; i < guildIds.length; i++) {
    const guildId = guildIds[i].get('guild_id') as string;

    const users = await userModel.findAll({
      where: { guild_id: guildId }
    });

    for (let j = 0; j < users.length; j++) {
      const user = users[j];

      const discordId = user.get('discord_id') as string;

      const discordUser = await client.users.fetch(discordId);

      if (!discordUser) {
        console.log('user undefined');
        return;
      }

      const employee: UserSchema = {
        name: user.get('name'),
        discord_id: user.get('discord_id'),
        guild_id: user.get('guild_id'),
        position: user.get('position'),
        project: user.get('project'),
        is_active: user.get('is_active')
      };

      const parsedQuery = await GenerateTimeSheetUrl(employee);

      if (!parsedQuery.is_success) {
        console.log('parsed query failed');
        return;
      }

      await discordUser.send(
        `Hi ${discordUser} here is the timesh**t link for today ` +
          '(ﾉ´ヮ`)ﾉ*: ･ﾟ \n' +
          process.env.PREDEFINED_URL +
          parsedQuery.message
      );
    }
  }

  client.destroy();
  exit();
});
