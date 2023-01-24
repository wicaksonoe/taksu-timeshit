import { SlashCommandBuilder } from 'discord.js';

export default interface Command {
  data: any;
  execute(interaction: any): Promise<void>;
}
