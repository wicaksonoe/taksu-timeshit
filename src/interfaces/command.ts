import {
  CacheType,
  ChatInputCommandInteraction,
  SlashCommandBuilder
} from 'discord.js';
import { Sequelize } from 'sequelize';

export default interface Command {
  data: SlashCommandBuilder | any;
  execute(
    interaction: ChatInputCommandInteraction<CacheType>,
    db?: Sequelize
  ): Promise<void>;
}
