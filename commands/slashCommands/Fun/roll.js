const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { logo, banner, footer, color } = require('../../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('roll')
        .setDescription('Rolls a dice.'),
    async execute(interaction) {
        const sides = 6;
        const result = Math.floor(Math.random() * sides) + 1;

        const embed = new EmbedBuilder()
            .setTitle('Dice Roll')
            .setDescription(`You rolled a ${result}!`)
            .setColor(color)
            .setImage(banner)
            .setFooter({ text: footer, iconUrl: logo });

        interaction.reply({ embeds: [embed] });
    },
};