const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const GuildConfig = require('../../../models/guildConfig.js');
const { logo, banner, footer, color } = require('../../../config.json');

module.exports = {
    name: 'warn',
    description: 'Issues a warning to a user.',
    category: 'Moderation',
    aliases: ['caution', 'alert'],
    async execute(message, args) {
        try {
        console.log('Executing command: warn');

        if (!message.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
            return message.reply('You do not have permissions to moderate members.');
        }

        const user = message.mentions.users.first();
        if (!user) {
            return message.reply('Please mention a user to warn.');
        }

        const reason = args.slice(1).join(' ') || 'No reason provided';

        const guildId = message.guild.id;
        const guildConfig = await GuildConfig.findOne({ guildId });
        if (!guildConfig || !guildConfig.logChannelId) {
            return message.reply('Log channel not set. Please configure a log channel for warnings!\nUse command `..setlogchannel`');
        }

        const logChannelId = guildConfig.logChannelId;
        const sender = message.author.id;

            const warnEmbed = new EmbedBuilder()
                .setColor(color)
                .setAuthor({ name: 'Jamify', iconURL: logo })
                .setTitle('⚠️ User Warned')
                .setImage(banner)
                .setDescription(`**User:** <@${user.id}>\n**Warned by:** <@${sender}>\n**Reason:** ${reason}`)
                .setFooter({ text: footer, iconURL: logo })
                .setTimestamp();

            const logChannel = message.guild.channels.cache.get(logChannelId);
            if (logChannel) {
                await logChannel.send({ embeds: [warnEmbed] });
                await message.channel.send({ embeds: [warnEmbed] });
            } else {
                console.error(`Log channel with ID ${logChannelId} not found.`);
            }

            console.log(`Warned ${user.tag} for: ${reason}`);
        } catch (error) {
            console.error(`Error executing warn command: ${error}`);
            message.reply('An error occurred while trying to warn the user.');
    }
}
};
