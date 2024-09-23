const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const GuildConfig = require('../../../models/guildConfig.js'); 
const { giphyk, logo, footer } = require('../../../config.json');
const fetch = require('node-fetch');

module.exports = {
  name: 'kick',
  description: 'Kicks a user.',
  category: 'Moderation',
  aliases: ['boot', 'remove', 'expel', 'banish'],
  async execute(message, args) {
    console.log('Executing command: kick');

    if (!message.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
      const noPermEmbed = new EmbedBuilder()
        .setColor('#FF0000')
        .setDescription('You do not have permissions to kick members.')
        .setFooter({ text: footer, iconUrl: logo })
        .setTimestamp();
      return message.reply({ embeds: [noPermEmbed] });
    }

    const user = message.mentions.users.first();
    if (!user) {
      const noUserEmbed = new EmbedBuilder()
        .setColor('#FF0000')
        .setDescription('Please mention a user to kick.')
        .setFooter({ text: footer, iconUrl: logo })
        .setTimestamp();
      return message.reply({ embeds: [noUserEmbed] });
    }

    const member = message.guild.members.resolve(user);
    if (!member) {
      const noMemberEmbed = new EmbedBuilder()
        .setColor('#FF0000')
        .setDescription('User not found.')
        .setFooter({ text: footer, iconUrl: logo })
        .setTimestamp();
      return message.reply({ embeds: [noMemberEmbed] });
    }

    if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.KickMembers)) {
      const noBotPermEmbed = new EmbedBuilder()
        .setColor('#FF0000')
        .setDescription('I do not have permissions to kick members.')
        .setFooter({ text: footer, iconUrl: logo })
        .setTimestamp();
      return message.reply({ embeds: [noBotPermEmbed] });
    }

    const reason = args.slice(1).join(' ') || 'No reason provided';

    const kickEmbed = new EmbedBuilder()
      .setColor('#FF0000')
      .setTitle('User Kicked')
      .setDescription(`${member} has been kicked by <@${message.author.id}> for: ${reason}`)
      .setFooter({ text: footer, iconUrl: logo })
      .setTimestamp();

    // Get the log channel ID from the database (assuming you've stored it)
    const guildId = message.guild.id;
    let guildConfig;
    try {
      guildConfig = await GuildConfig.findOne({ guildId });
    } catch (error) {
      console.error('Error fetching guild config:', error);
      const errorEmbed = new EmbedBuilder()
        .setColor('#FF0000')
        .setDescription('Error fetching guild config. Please try again later.')
        .setFooter({ text: footer, iconUrl: logo })
        .setTimestamp();
      return message.reply({ embeds: [errorEmbed] });
    }
    const logChannelId = guildConfig?.logChannelId;

    if (!logChannelId) {
      const noLogChannelEmbed = new EmbedBuilder()
        .setColor('#FF0000')
        .setDescription('Log channel not set. Please configure a log channel for audit logs.')
        .setFooter({ text: footer, iconUrl: logo })
        .setTimestamp();
      return message.reply({ embeds: [noLogChannelEmbed] });
    }

    // Send the kick message to the log channel
    const logChannel = message.guild.channels.cache.get(logChannelId);
    if (logChannel) {
      try {
        await logChannel.send({ embeds: [kickEmbed] });
      } catch (error) {
        console.error('Error sending message to log channel:', error);
      }
    } else {
      console.error(`Log channel with ID ${logChannelId} not found.`);
    }

    // Kick the user
    try {
      await member.kick(reason);
      try {
        await message.reply({ embeds: [kickEmbed] });
      } catch (error) {
        console.error('Error sending message to user:', error);
      }
    } catch (error) {
      console.error('Error kicking user:', error);
      // Handle the error if necessary
    }
  }
};
