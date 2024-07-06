const { PermissionsBitField } = require("discord.js");
const GuildConfig = require('../../../models/guildConfig.js')

module.exports = {
    name: 'setlogchannel',
    description: 'Set the log channel and specify whom to ping.(ping is optional)',
    category: 'utility',
    async execute(message, args) {
        // Check if the user has Administrator permissions
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return message.reply('Only users with Administrator permissions can set the log channel.');
        }

        const logChannel = message.mentions.channels.first();
        if (!logChannel) {
            return message.reply('Please mention a valid channel to set as the log channel.');
        }

        const pingRole = message.mentions.roles.first();

        // Save the data to MongoDB
        try {
            await GuildConfig.findOneAndUpdate(
                { guildId: message.guild.id },
                { logChannelId: logChannel.id, pingRoleId: pingRole?.id },
                { upsert: true }
            );
            message.reply('Log channel and ping role set successfully.');
        } catch (error) {
            console.error('Error saving data to MongoDB:', error);
            message.reply('There was an error setting the log channel and ping role.');
        }
    },
};