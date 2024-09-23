const { EmbedBuilder } = require('discord.js');
const { logo, banner, footer } = require('../../../config.json');

module.exports = {
    name: 'serverinfo',
    description: 'Displays server information.',
    category: 'Settings',
    aliases: ['si', 'sinfo', 's', 'server', 'serverstats', 'guildinfo'],
    execute(message) {
        console.log('Executing command: serverinfo');
        const { guild } = message;
        const botCount = guild.members.cache.filter(member => member.user.bot).size;
        const embed = new EmbedBuilder()
            .setTitle(`${guild.name} Server Information`)
            .setThumbnail(guild.iconURL())
            .addFields(
                { name: '👥 Members', value: guild.memberCount.toString(), inline: true },
                { name: '🤖 Bots', value: botCount.toString(), inline: true },
                { name: '👑 Owner', value: `<@${guild.ownerId}>`, inline: true },
                { name: '📅 Created On', value: guild.createdAt.toDateString(), inline: true },
                { name: '🌍 Region', value: guild.region, inline: true },
                { name: '🔒 Verification Level', value: guild.verificationLevel, inline: true },
                { name: '💬 Text Channels', value: guild.channels.cache.filter(channel => channel.type === 'GUILD_TEXT').size.toString(), inline: true },
                { name: '🔊 Voice Channels', value: guild.channels.cache.filter(channel => channel.type === 'GUILD_VOICE').size.toString(), inline: true },
                { name: '🛡️ Roles', value: guild.roles.cache.size.toString(), inline: true },
                { name: '🚀 Boost Level', value: guild.premiumTier.toString(), inline: true }
            )
            .setColor('#00AAFF')
            .setImage(banner)
            .setFooter({ text: footer, iconURL: logo });
        message.channel.send({ embeds: [embed] });
    },
};
