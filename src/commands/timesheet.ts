import { SlashCommandBuilder } from 'discord.js';
import moment from 'moment';
import Command from '../interfaces/command';

const command: Command = {
  data: new SlashCommandBuilder()
    .setName('ts')
    .setDescription('Generate Time Sheeett!'),
  execute: async (interaction: any) => {
    const fields = [
      {
        key: 'entry.2116052852',
        value: 'NAME'
      },
      {
        key: 'entry.532096719',
        value: 'POSITION'
      },
      {
        key: 'entry.1369552271',
        value: 'PROJECT'
      },
      {
        key: 'entry.1060472253',
        value: moment().format('YYYY-MM-DD')
      }
    ];

    const parsedQuery = fields.map((x) => `${x.key}=${x.value}`).join('&');

    // entry.2116052852=I+Gede+Agung+Wicaksono+Dharmayasa&
    // entry.532096719=Software+Developer&
    // entry.1369552271=WTS&
    // entry.1060472253=

    await interaction.reply(
      `Hi ${interaction.user} \n` + process.env.PREDEFINED_URL + parsedQuery
    );

    setTimeout(() => interaction.deleteReply(), 10000);
  }
};

export { command };
