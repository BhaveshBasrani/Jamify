const { EmbedBuilder, ChannelType } = require('discord.js');
const { logo, banner, footer } = require('../../../config.json');

module.exports = {
    name: 'serverinfo',
    description: 'Displays server information.',
    category: 'Settings',
    aliases: ['si', 'sinfo', 's', 'server', 'serverstats', 'guildinfo'],
    async execute(message) {
        console.log('Executing command: serverinfo');
        const { guild } = message;
        const fetchedMembers = await guild.members.fetch();
        const botCount = fetchedMembers.filter(member => member.user.bot).size;
        const roles = await guild.roles.fetch();
        const textChannels = await guild.channels.fetch().then(channels => channels.filter(channel => channel.type === ChannelType.GuildText).size);
        const voiceChannels = await guild.channels.fetch().then(channels => channels.filter(channel => channel.type === ChannelType.GuildVoice).size);

        const embed = new EmbedBuilder()
            .setTitle(`${guild.name} Server Information`)
            .setThumbnail(guild.iconURL())
            .addFields(
            { name: '👥 Members', value: guild.memberCount.toString(), inline: true },
            { name: '🤖 Bots', value: botCount.toString(), inline: true },
            { name: '👑 Owner', value: `<@${guild.ownerId}>`, inline: true },
            { name: '📅 Created On', value: guild.createdAt.toDateString(), inline: true },
            { name: '🌍 Region', value: guild.preferredLocale, inline: true },
            { name: '🔒 Verification Level', value: guild.verificationLevel, inline: true },
            { name: '💬 Text Channels', value: textChannels.toString(), inline: true },
            { name: '🔊 Voice Channels', value: voiceChannels.toString(), inline: true },
            { name: '🛡️ Roles', value: roles.size.toString(), inline: true },
            { name: '🚀 Boost Level', value: guild.premiumTier.toString(), inline: true }
            )
            .setColor('#00AAFF')
            .setImage(banner)
            .setFooter({ text: footer, iconURL: logo });

        message.channel.send({ embeds: [embed] });
    },
};