import * as fs from 'node:fs';
import * as path from 'node:path';
import {
  Client,
  Collection,
  Events,
  GatewayIntentBits,
  REST,
  Routes
} from 'discord.js';
import * as dotenv from 'dotenv';
import Command from './interfaces/command';
import { Sequelize } from 'sequelize';
import Users, { UserSchema } from './models/users';

dotenv.config({ path: require('find-config')('.env') });
console.log('TOKEN: ', process.env.BOT_TOKEN);

// initialize client
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// initialize db
const db = new Sequelize({ dialect: 'sqlite', storage: 'database.sqlite' });

try {
  db.authenticate();
  console.log('Connection to the database established successfully.');
} catch (error) {
  console.log('Unable to connect to the database: ', error);
}

const commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath);

console.log('command files found: ', commandFiles.length);

commandFiles.map((file) => {
  const filePath = path.join(commandsPath, file);
  const content = require(filePath);
  const command = content.command as Command;

  if ('data' in command && 'execute' in command) {
    commands.set(command.data.name, command);
  } else {
    console.log('something went wrong');
  }
});

client.once(Events.ClientReady, (x) => {
  Users(db).sync();
  console.log(`Ready! Logged in as ${x.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  console.log('HEHEHE: ', interaction.user.id);

  const command = commands.get(interaction.commandName) as Command;

  if (!command) {
    console.error(`No command match with ${interaction.commandName}`);
    return;
  }

  try {
    await command.execute(interaction, db);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: 'There was an error while executing this command!',
      ephemeral: true
    });
  }
});

client.login(process.env.BOT_TOKEN);

// REST for command list
const commandList: Array<any> = [];
commandFiles.map((file) => {
  const content = require(`./commands/${file}`);
  commandList.push(content.command.data);
});

// Construct and prepare an instance of the REST module
const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN!);

// and deploy your commands!
(async () => {
  try {
    console.log(
      `Started refreshing ${commandList.length} application (/) commands.`
    );

    console.log(commandList);

    // The put method is used to fully refresh all commands in the guild with the current set
    const data = (await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID!),
      { body: commandList }
    )) as any;

    console.log(
      `Successfully reloaded ${data.length} application (/) commands.`
    );
  } catch (error) {
    // And of course, make sure you catch and log any errors!
    console.error(error);
  }
})();
