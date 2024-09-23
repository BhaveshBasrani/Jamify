const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const GuildConfig = require('../../../models/guildConfig.js'); // Adjust the path as needed
const fetch = require('node-fetch');
const { giphyk, logo, footer } = require('../../../config.json');

module.exports = {
  name: 'revoke',
  description: 'Revokes a user\'s ban.',
  category: 'Moderation',
  aliases: ['unban', 'pardon'],
  async execute(message, args) {
    console.log('Executing command: revoke');
    if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
      return message.reply('You do not have permissions to revoke bans.');
    }

    const userId = args[0];
    if (!userId) {
      return message.reply('Please provide the ID of the user to revoke the ban.');
    }

    const guild = message.guild;
    try {
      await guild.members.unban(userId);
    } catch (error) {
      return message.reply('Failed to revoke ban. Please check the user ID and try again.');
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
      .setTitle('User Ban Revoked')
      .setImage(gifUrl)
      .setFooter({ text: footer, iconUrl: logo })
      .setDescription(`<@${userId}> has had their ban revoked for: ${reason}\nBy: <@${sender}>`)
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