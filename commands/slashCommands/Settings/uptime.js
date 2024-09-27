const { EmbedBuilder } = require('discord.js');
const { logo, banner, footer, color } = require('../../../config.json');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('uptime')
        .setDescription('Shows bot\'s uptime.'),
    async execute(interaction) {
        let totalSeconds = Math.floor(interaction.client.uptime / 1000);
        let days = Math.floor(totalSeconds / 86400);
        let hours = Math.floor(totalSeconds / 3600) % 24;
        let minutes = Math.floor(totalSeconds / 60) % 60;
        let seconds = Math.floor(totalSeconds % 60);

        const embed = new EmbedBuilder()
            .setTitle('⏱️ Bot Uptime')
            .setDescription(`The bot has been running for:`)
            .addFields(
                { name: '🗓️ Days', value: `**${days}**`, inline: true },
                { name: '⏰ Hours', value: `**${hours}**`, inline: true },
                { name: '⏳ Minutes', value: `**${minutes}**`, inline: true },
                { name: '⏱️ Seconds', value: `**${seconds}**`, inline: true }
            )
            .setColor(color)
            .setTimestamp()
            .setThumbnail(logo)
            .setImage(banner)
            .setFooter({ text: footer, iconURL: logo });

        const msg = await interaction.reply({ embeds: [embed], fetchReply: true });

        setInterval(async () => {
            totalSeconds = Math.floor(interaction.client.uptime / 1000);
            days = Math.floor(totalSeconds / 86400);
            hours = Math.floor(totalSeconds / 3600) % 24;
            minutes = Math.floor(totalSeconds / 60) % 60;
            seconds = Math.floor(totalSeconds % 60);

            embed.data.fields[0].value = `**${days}**`;
            embed.data.fields[1].value = `**${hours}**`;
            embed.data.fields[2].value = `**${minutes}**`;
            embed.data.fields[3].value = `**${seconds}**`;

            await msg.edit({ embeds: [embed] });
        }, 1000); // update every 1 second
    },
};