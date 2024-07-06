const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const GuildConfig = require('../../../models/guildConfig.js'); 
const giphyk = require('../../../config.json')
const fetch = require('node-fetch')

module.exports = {
    name: 'kick',
    description: 'Kicks a user.',
    category: 'utility',
    async execute(message, args) {
        console.log('Executing command: kick');
        if (!message.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
            return message.reply('You do not have permissions to kick members.');
        }

        const user = message.mentions.users.first();
        if (!user) {
            return message.reply('Please mention a user to kick.');
        }

        const member = message.guild.members.resolve(user);
        if (!member) {
            return message.reply('User not found.');
        }

        if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.KickMembers)) {
            return message.reply('I do not have permissions to kick members.');
        }

        const reason = args.slice(1).join(' ') || 'No reason provided';
        if (reason.length > 512) {
            reason = reason.substring(0, 512);
        }

        // Get a random kick-related GIF from Giphy
        const url = `https://api.giphy.com/v1/gifs/search?q=Kick&api_key=${giphyk}&limit=5`;
        const res = await fetch(url);
        const data = await res.json();
        const gifUrl = data.data[0].images.original.url;
        
        const kickEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('User Kicked')
                .setDescription(`${member} has been kicked by <@${message.author.id}> for: ${reason}`)
                .setImage(gifUrl)
                .setTimestamp();

        // Get the log channel ID from the database (assuming you've stored it)
        const guildId = message.guild.id;
        const guildConfig = await GuildConfig.findOne({ guildId });
        const logChannelId = guildConfig?.logChannelId;

        if (!logChannelId) {
            return message.reply('Log channel not set. Please configure a log channel for audit logs.');
        }

        // Send the kick message to the log channel
        const logChannel = message.guild.channels.cache.get(logChannelId);
        if (logChannel) {
            logChannel.send({ embeds: [kickEmbed] });
        } else {
            console.error(`Log channel with ID ${logChannelId} not found.`);
        }

        // Kick the user
        try {
            await member.kick(reason);
            message.reply({ embeds: [kickEmbed] });
            console.log(`Successfully kicked ${user.username}`);
        } catch (error) {
            console.error('Error kicking user:', error);
            message.reply('Unable to kick user.');
        }
    },
};