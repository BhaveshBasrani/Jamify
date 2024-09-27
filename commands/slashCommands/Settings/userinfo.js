const { EmbedBuilder } = require('discord.js');
const { logo, footer, color, banner } = require('../../../config.json');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('userinfo')
        .setDescription('Displays detailed information about the user.')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('The user to get information about')
                .setRequired(false)
        ),
    async execute(interaction) {
        const member = interaction.options.getMember('user') || interaction.member;
        const embed = new EmbedBuilder()
            .setTitle('👤 User Info')
            .setThumbnail(member.user.displayAvatarURL())
            .setColor(color)
            .setImage(banner)
            .setFooter({ text: footer, iconURL: logo });

        embed.addFields(
            { name: '🆔 Username', value: member.user.tag, inline: true },
            { name: '🆔 ID', value: member.user.id, inline: true },
            { name: '📅 Joined Server', value: member.joinedAt.toDateString(), inline: true },
            { name: '📅 Account Created', value: member.user.createdAt.toDateString(), inline: true },
            { name: '🎮 Status', value: member.presence?.status || 'offline', inline: true },
            { name: '🎨 Roles', value: member.roles.cache.map(role => role.name).join(', '), inline: true },
            { name: '🔗 Avatar URL', value: `[Avatar](${member.user.displayAvatarURL()})`, inline: true },
        );

        await interaction.reply({ embeds: [embed] });
    },
};