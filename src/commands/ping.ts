import { SlashCommandBuilder } from 'discord.js';
import Command from '../interfaces/command';

const command: Command = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with pong!'),
  execute: async (interaction: any) => {
    await interaction.reply('Pong!');
  }
};

export { command };
