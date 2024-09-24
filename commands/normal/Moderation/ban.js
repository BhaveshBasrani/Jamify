const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const GuildConfig = require('../../../models/guildConfig.js'); // Adjust the path as needed
const { logo, banner, footer, color } = require('../../../config.json');

module.exports = {
  name: 'ban',
  description: 'Bans a user.',
  category: 'Moderation',
  aliases: ['banish', 'remove'],
  async execute(message, args) {
    console.log('Executing command: ban');

    // Check if the user has the necessary permissions
    if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
      return message.reply('You do not have permissions to ban members.');
    }

    // Get the user ID from the arguments
    const userId = args[0];
    if (!userId) {
      return message.reply('Please provide the ID of the user to ban.');
    }

    // Validate the user ID
    if (!/^\d{18}$/.test(userId)) {
      return message.reply('Invalid user ID. User IDs must be 18 digits long.');
    }

    // Fetch the member
    let member;
    try {
      member = await message.guild.members.fetch(userId);
    } catch (error) {
      console.error('Error fetching member:', error);
      return message.reply('User not found.');
    }

    // Check if the user is trying to ban themselves
    if (member.id === message.author.id) {
      return message.reply('You cannot ban yourself.');
    }

    // Get the reason from the arguments
    let reason = args.slice(1).join(' ') || 'No reason provided';

    // Truncate the reason to 512 characters
    if (reason.length > 512) {
      reason = reason.substring(0, 512);
    }

    // Fetch the guild config
    let guildConfig;
    try {
      guildConfig = await GuildConfig.findOne({ guildId: message.guild.id });
    } catch (error) {
      console.error('Error fetching guild config:', error);
      return message.reply('Failed to fetch guild config');
    }

    // Check if the log channel is set
    const logChannelId = guildConfig?.logChannelId;
    if (!logChannelId) {
      return message.reply('Log channel not set. Please configure a log channel for audit logs. Use command `..setlogchannel`');
    }

    // Fetch the log channel
    const logChannel = message.guild.channels.cache.get(logChannelId);
    if (!logChannel) {
      console.error(`Log channel with ID ${logChannelId} not found.`);
      return message.reply('Log channel not found.');
    }

    // Create the ban embed
    const banEmbed = new EmbedBuilder()
      .setColor(color)
      .setTitle('User Banned')
      .setDescription(`**<@${userId}>** has been banned for: ${reason}\nBy: **<@${message.author.id}>**`)
      .setTimestamp()
      .setFooter({ text: footer, iconUrl: logo });

    // Send the ban embed to the log channel
    try {
      await logChannel.send({ embeds: [banEmbed] });
    } catch (error) {
      console.error('Error sending message to log channel:', error);
      return message.reply('Unable to send message to log channel.');
    }

    // Ban the user
    try {
      await message.guild.members.ban(userId, { reason });
      message.reply({ embeds: [banEmbed] });
      console.log('User banned successfully!');
    } catch (error) {
      console.error('Error banning user:', error);
      return message.reply('Unable to ban user.');
    }
  }
};
