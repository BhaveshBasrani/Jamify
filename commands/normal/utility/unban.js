const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const GuildConfig = require('../../../models/guildConfig.js'); // Adjust the path as needed
const fetch = require('node-fetch');
const { giphyk } = require('../../../config.json');

module.exports = {
  name: 'unban',
  description: 'Unbans a user.',
  category: 'utility',
  async execute(message, args) {
    console.log('Executing command: unban');
    if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
      return message.reply('You do not have permissions to unban members.');
    }

    const userId = args[0];
    if (!userId) {
      return message.reply('Please provide the ID of the user to unban.');
    }

    const guild = message.guild;
    try {
      await guild.members.unban(userId);
    } catch (error) {
      return message.reply('Failed to unban user. Please check the user ID and try again.');
    }

    const sender = message.author.id;
    const reason = args.slice(1).join(' ') || 'No reason provided';

    // Get the log channel ID from the database (assuming you've stored it)
    const guildId = message.guild.id;
    const guildConfig = await GuildConfig.findOne({ guildId });
    const logChannelId = guildConfig?.logChannelId;

    if (!logChannelId) {
      return message.reply('Log channel not set. Please configure a log channel for audit logs. \nUse command `..setlogchannel`');
    }

    const url = `https://api.giphy.com/v1/gifs/search?q=Party&api_key=${giphyk}&limit=5`;
    let data;
    try {
      const res = await fetch(url);
      data = await res.json();
    } catch (error) {
      console.error('Failed to retrieve GIF from Giphy API');
      return message.reply('Failed to retrieve GIF from Giphy API');
    }

    if (!data || !data.data || !data.data[0]) {
      console.error('Failed to retrieve GIF from Giphy API');
      return message.reply('Failed to retrieve GIF from Giphy API');
    }

    const gifUrl = data.data[0].images.original.url;

    const unbanEmbed = new EmbedBuilder()
      .setColor('#00FF00')
      .setTitle('User Unbanned')
      .setImage(gifUrl)
      .setDescription(`<@${userId}> has been unbanned for: ${reason}\nBy: <@${sender}>`)
      .setTimestamp();

    // Send the unban message to the log channel
    const logChannel = message.guild.channels.cache.get(logChannelId);
    if (logChannel) {
      logChannel.send({ embeds: [unbanEmbed] });
    } else {
      console.error(`Log channel with ID ${logChannelId} not found.`);
    }

    message.reply({ content: '', embeds: [unbanEmbed] });
  },
};