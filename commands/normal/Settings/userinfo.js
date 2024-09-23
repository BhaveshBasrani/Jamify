const { EmbedBuilder } = require('discord.js');
const { logo, banner, footer } = require('../../../config.json');

module.exports = {
    name: 'userinfo',
    description: 'Displays detailed information about the user.',
    category: 'Settings',
    aliases: ['ui', 'user', 'u', 'user-info', 'userdetails', 'whois'],
    async execute(message) {
        const member = message.mentions.members.first() || message.member;
        const embed = new EmbedBuilder()
            .setTitle('👤 User Info')
            .setThumbnail(member.user.displayAvatarURL())
            .setColor('Green')
            .setImage(banner)
            .setFooter({ text: footer, iconURL: logo });

        embed.data.fields = [
            { name: '🆔 Username', value: member.user.tag, inline: true },
            { name: '🆔 ID', value: member.user.id, inline: true },
            { name: '📅 Joined Server', value: member.joinedAt.toDateString(), inline: true },
            { name: '📅 Account Created', value: member.user.createdAt.toDateString(), inline: true },
            { name: '🎮 Status', value: member.presence?.status || 'offline', inline: true },
            { name: '🎨 Roles', value: member.roles.cache.map(role => role.name).join(', '), inline: true },
            { name: '🔗 Avatar URL', value: `[Avatar](${member.user.displayAvatarURL()})`, inline: true },
        ];

        message.channel.send({ embeds: [embed] });
    },
};