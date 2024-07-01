const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('userinfo')
        .setDescription('Displays information about the user.')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The user to get information about')
                .setRequired(false)),
    async execute(interaction) {
        const member = interaction.options.getMember('target') || interaction.member;
        const embed = new EmbedBuilder()
            .setTitle('User Info')
            .setThumbnail(member.user.displayAvatarURL())
            .addFields(
                { name: 'Username', value: member.user.tag, inline: true },
                { name: 'ID', value: member.user.id, inline: true },
                { name: 'Joined Server', value: member.joinedAt.toDateString(), inline: false },
                { name: 'Account Created', value: member.user.createdAt.toDateString(), inline: false }
            )
            .setColor('Green')
            .setImage('https://cdn.discordapp.com/attachments/1083025959659245578/1255924342836170782/standard.gif?ex=667ee631&is=667d94b1&hm=df73dbc902c6b853b57e7f324244e272bda2a84c471d7a2e567f698e68326e35&')
            .setFooter({ text: '© 2024 Jamify All rights reserved.', iconURL: 'https://cdn.discordapp.com/attachments/1083025959659245578/1256226568997703790/e2e7d7f843961fdb91063a5dac128ccb.png?ex=667fffa9&is=667eae29&hm=17f714a7058d5c68e731d76e12fafa94cce4af9d0a2992ad4fad2a5b47af464c&' });

        await interaction.reply({ embeds: [embed] });
    },
};
