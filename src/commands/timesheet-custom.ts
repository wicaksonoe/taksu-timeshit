import { SlashCommandBuilder } from 'discord.js';
import moment from 'moment';
import Command from '../interfaces/command';

const command: Command = {
  data: new SlashCommandBuilder()
    .setName('ts-date')
    .setDescription('Generate Time Sheeett with DATE!')
    .addStringOption((option) =>
      option
        .setName('date')
        .setDescription('Date for timesheet. Format: YYYY-MM-DD')
        .setRequired(true)
    ),
  execute: async (interaction: any) => {
    const date = interaction.options.getString('date');

    await interaction.reply(
      `Hi ${interaction.user} \n` +
        process.env.PREDEFINED_URL +
        moment(date, 'YYYY-MM-DD').format('YYYY-MM-DD')
    );

    setTimeout(() => interaction.deleteReply(), 10000);
  }
};

export { command };
