import {
  CacheType,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  User
} from 'discord.js';
import moment from 'moment';
import { Sequelize } from 'sequelize';
import Command from '../interfaces/command';
import Users, { UserSchema } from '../models/users';
import { GenerateTimeSheetUrl } from '../utils/generator';

const command: Command = {
  data: new SlashCommandBuilder()
    .setName('ts-date')
    .setDescription('Generate Time Sheeett with DATE!')
    .addStringOption((option) =>
      option
        .setName('date')
        .setDescription('Format: YYYY-MM-DD')
        .setRequired(true)
    ),
  execute: async (
    interaction: ChatInputCommandInteraction<CacheType>,
    db: Sequelize
  ) => {
    const date = interaction.options.getString('date');

    const sender = interaction.user as User | undefined;
    if (!sender) return;

    const guildId = interaction.guildId;

    const userModel = Users(db);

    const userInfo = await userModel.findOne({
      where: { discord_id: sender.id, guild_id: guildId }
    });

    if (!userInfo) {
      await interaction.reply(
        "Your account doesn't registered on my database."
      );
      setTimeout(() => interaction.deleteReply(), 30_000);
      return;
    }

    const employee: UserSchema = {
      name: userInfo.get('name'),
      discord_id: userInfo.get('discord_id'),
      guild_id: userInfo.get('guild_id'),
      position: userInfo.get('position'),
      project: userInfo.get('project'),
      is_active: userInfo.get('is_active')
    };

    const parsedQuery = await GenerateTimeSheetUrl(
      employee,
      moment(date, 'YYYY-MM-DD').format('YYYY-MM-DD')
    );

    await interaction.reply(
      "Got it. Your timesh**t already sent via DM. Don't report me as spam pleasee. \n.･ﾟﾟ･(／ω＼)･ﾟﾟ･."
    );
    setTimeout(() => interaction.deleteReply(), 30_000);

    await sender.send(
      `Hi ${interaction.user} here the link ` +
        '(ﾉ´ヮ`)ﾉ*: ･ﾟ \n' +
        process.env.PREDEFINED_URL +
        parsedQuery.message
    );
  }
};

export { command };
