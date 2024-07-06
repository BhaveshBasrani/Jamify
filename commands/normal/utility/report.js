const { EmbedBuilder } = require('discord.js');
const GuildConfig = require('../../../models/guildConfig.js'); // Adjust the path as needed

module.exports = {
    name: 'report',
    description: 'Reports a user.',
    category: 'utility',
    async execute(message, args) {
        console.log('Executing command: report');
        const user = message.mentions.users.first();
        if (!user) {
            return message.reply('Please mention a user to report.');
        }
        const reason = args.slice(1).join(' ') || 'No reason provided';

        // Get the log channel ID from the database (assuming you've stored it)
        const guildId = message.guild.id;
        const guildConfig = await GuildConfig.findOne({ guildId });
        const logChannelId = guildConfig?.logChannelId;

        if (!logChannelId) {
            return message.reply('Log channel not set. Please configure a log channel for audit logs.');
        }
        
        const reportEmbed = new EmbedBuilder()
        .setColor('#FFD700')
        .setTitle('User Reported')
        .setDescription(`${user.tag} has been reported by ${message.author.tag} for: ${reason}`)
        .setTimestamp();

        // Send the report message to the log channel
        const logChannel = message.guild.channels.cache.get(logChannelId);
        if (logChannel) {
            
            logChannel.send({ embeds: [reportEmbed] });
        } else {
            console.error(`Log channel with ID ${logChannelId} not found.`);
        }

        // Respond to the user
        message.reply({ embeds: [reportEmbed] });
        console.log(`Reported ${user.tag} for: ${reason}`);
    },
};
