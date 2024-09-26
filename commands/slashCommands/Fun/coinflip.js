const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const { logo, banner, footer, color } = require('../../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('coinflip')
    .setDescription('Flips a coin.'),
  async execute(interaction) {
    const result = Math.random() < 0.5 ? 'Heads' : 'Tails';

    const embed = new EmbedBuilder()
      .setTitle('Coin Flip')
      .setDescription(`The coin landed on ${result}!`)
      .setColor(color)
      .setImage(banner)
      .setFooter({ text: footer, iconUrl: logo });

    await interaction.reply({ embeds: [embed] });
  },
};