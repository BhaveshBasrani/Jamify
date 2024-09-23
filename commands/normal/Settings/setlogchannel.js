const { PermissionsBitField } = require("discord.js");
const GuildConfig = require('../../../models/guildConfig.js');

module.exports = {
    name: 'setlogchannel',
    description: 'Set the log channel and specify whom to ping (ping is optional)',
    category: 'Settings',
    aliases: ['setlog', 'logchannel'],
    async execute(message, args) {
        try {
            if (!hasAdminPermissions(message)) {
                return message.reply('Only users with Administrator permissions can set the log channel.');
            }

            const logChannel = getLogChannel(message);
            if (!logChannel) {
                return message.reply('Please mention a valid channel to set as the log channel.');
            }

            const pingRole = getPingRole(message);

            await saveConfigToDB(message.guild.id, logChannel.id, pingRole?.id);
            message.reply('Log channel and ping role set successfully.');
        } catch (error) {
            handleError(error, message);
        }
    },
};

function hasAdminPermissions(message) {
    return message.member.permissions.has(PermissionsBitField.Flags.Administrator);
}

function getLogChannel(message) {
    return message.mentions.channels.first();
}

function getPingRole(message) {
    return message.mentions.roles.first();
}

async function saveConfigToDB(guildId, logChannelId, pingRoleId) {
    await GuildConfig.findOneAndUpdate(
        { guildId },
        { logChannelId, pingRoleId },
        { upsert: true }
    );
}

function handleError(error, message) {
    console.error('Error:', error);
    message.reply('There was an error setting the log channel and ping role.');
}