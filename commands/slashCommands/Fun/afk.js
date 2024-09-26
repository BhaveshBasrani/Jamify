const { SlashCommandBuilder } = require('@discordjs/builders');
const { Collection, Events } = require('discord.js');
const afkCollection = new Collection();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('afk')
    .setDescription('Toggle AFK status and notify others when mentioned.')
    .addStringOption(option => option.setName('reason').setDescription('The reason for being AFK')),
  async execute(interaction) {
    const userId = interaction.user.id;

    if (afkCollection.has(userId)) {
      afkCollection.delete(userId);
      return interaction.reply(`👋 **Your AFK status has been removed.** Welcome back, ${interaction.user.username}!`);
    }

    const reason = interaction.options.getString('reason') || 'no reason';
    afkCollection.set(userId, reason);
    return interaction.reply(`💤 You're now AFK: ${reason}`);
  },
  handleMentions: async (message) => {
    if (message.author.bot) return;

    const mentionedUsers = message.mentions.users;

    mentionedUsers.forEach(user => {
      if (afkCollection.has(user.id)) {
        const reason = afkCollection.get(user.id);
        message.reply(`💤 <@${user.username}> **is currently AFK:** ${reason}`);
      }
    });
  }
};