import {
  CacheType,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  User
} from 'discord.js';
import { Sequelize } from 'sequelize';
import Command from '../interfaces/command';
import Users, { UserSchema } from '../models/users';

const command: Command = {
  data: new SlashCommandBuilder()
    .setName('register')
    .setDescription('Register yrself in my database. YAY!')
    .addStringOption((opt) =>
      opt
        .setName('key')
        .setDescription('-')
        .setRequired(true)
        .addChoices(
          { name: 'Name', value: 'name' },
          { name: 'Position', value: 'position' },
          { name: 'Project', value: 'project' }
        )
    )
    .addStringOption((opt) =>
      opt.setName('value').setDescription('-').setRequired(true)
    ),
  execute: async (
    interaction: ChatInputCommandInteraction<CacheType>,
    db: Sequelize
  ) => {
    const sender = interaction.user as User | undefined;
    if (!sender) return;

    const key = interaction.options.getString('key') ?? '';
    const value = interaction.options.getString('value');
    const payload: any = {};
    payload[key] = value;

    const userModel = Users(db);

    const userInfo = await userModel.findOne({
      where: { discord_id: sender.id, guild_id: interaction.guildId }
    });

    if (!userInfo) {
      const user: UserSchema = {
        discord_id: sender.id,
        guild_id: interaction.guildId,
        name: '',
        position: '',
        project: ''
      };

      userModel.create({ ...user });
    }

    userModel.update(
      { ...payload },
      {
        where: { discord_id: sender.id, guild_id: interaction.guildId }
      }
    );

    await interaction.reply('Got it.');
    setTimeout(() => interaction.deleteReply(), 30_000);
  }
};

export { command };
