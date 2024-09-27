const { EmbedBuilder } = require('discord.js');
const { logo, banner, footer, color } = require('../../../config.json');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Checks the bot\'s latency and provides additional information.'),
    async execute(interaction) {
        const ping = Date.now() - interaction.createdTimestamp;
        const apiPing = interaction.client.ws.ping;

        const embed = new EmbedBuilder()
            .setTitle('🏓 Pong!')
            .addFields(
                { name: 'Latency', value: `${ping}ms 🕒`, inline: true },
                { name: 'API Latency', value: `${apiPing}ms 🌐`, inline: true }
            )
            .setColor(color)
            .setImage(banner)
            .setFooter({ text: footer, iconURL: logo })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};