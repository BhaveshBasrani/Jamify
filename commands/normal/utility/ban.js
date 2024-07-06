const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const GuildConfig = require('../../../models/guildConfig.js'); // Adjust the path as needed
const fetch = require('node-fetch');
const { giphyk } = require('../../../config.json');

module.exports = {
    name: 'ban',
    description: 'Bans a user.',
    category: 'utility',
    async execute(message, args) {
        console.log('Executing command: ban');
        const url = `https://api.giphy.com/v1/gifs/search?q=Ban&api_key=${giphyk}&limit=5`;
        let res;
        try {
            res = await fetch(url);
        } catch (error) {
            console.error('Error fetching GIF from Giphy API:', error);
            return message.reply('Failed to retrieve GIF from Giphy API');
        }
        let data;
        try {
            data = await res.json();
        } catch (error) {
            console.error('Error parsing JSON response from Giphy API:', error);
            return message.reply('Failed to retrieve GIF from Giphy API');
        }

        if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            return message.reply('You do not have permissions to ban members.');
        }

        const userId = args[0];
        if (!userId) {
            return message.reply('Please provide the ID of the user to ban.');
        }

        // Discord user IDs are always 18 characters long
        if (userId.length!== 18) {
            return message.reply('Invalid user ID. User IDs are 18 characters long.');
        }

        let member;
        try {
            member = await message.guild.members.fetch(userId);
        } catch (error) {
            console.error('Error fetching member:', error);
            return message.reply('User not found.');
        }

        if (member.id === message.author.id) {
            return message.reply('You cannot ban yourself.');
        }

        const sender = message.author.id;
        const reason = args.slice(1).join(' ') || 'No reason provided';

        if (reason.length > 512) {
            reason = reason.substring(0, 512);
        }

        const guildId = message.guild.id;
        let guildConfig;
        try {
            guildConfig = await GuildConfig.findOne({ guildId });
        } catch (error) {
            console.error('Error fetching guild config:', error);
            return message.reply('Failed to fetch guild config');
        }
        const logChannelId = guildConfig?.logChannelId;

        if (!logChannelId) {
            return message.reply('Log channel not set. Please configure a log channel for audit logs. Use command `..setlogchannel`');
        }

        if (!data ||!data.data ||!data.data[0]) {
            console.error('Failed to retrieve GIF from Giphy API');
            return message.reply('Failed to retrieve GIF from Giphy API');
        }

        const gifUrl = data.data[0].images.original.url;

        const banEmbed = new EmbedBuilder()
           .setColor('#FF0000')
           .setTitle('User Banned')
           .setImage(gifUrl)
           .setDescription(`**<@${userId}>** has been banned for: ${reason}\nBy: **<@${sender}>**`)
           .setTimestamp();

        const logChannel = message.guild.channels.cache.get(logChannelId);
        if (!logChannel) {
            console.error(`Log channel with ID ${logChannelId} not found.`);
            return message.reply('Log channel not found.');
        }

        try {
            await logChannel.send({ embeds: [banEmbed] });
        } catch (error) {
            console.error('Error sending message to log channel:', error);
            return message.reply('Unable to send message to log channel.');
        }

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