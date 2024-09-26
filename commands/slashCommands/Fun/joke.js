const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');
const { logo, banner, footer, color } = require('../../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('joke')
    .setDescription('Tells a random, appropriate joke.'),
  async execute(interaction) {
    await interaction.deferReply();
    try {
      const response = await fetch('https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,religious,political');
      const data = await response.json();

      const jokeEmbed = new EmbedBuilder()
        .setColor(color)
        .setAuthor({ name: 'Jamify', iconURL: logo })
        .setTitle('🤣 Joke 🤣')
        .setImage(banner)
        .setFooter({ text: footer });

      if (data.type === 'single') {
        jokeEmbed.setDescription(data.joke);
      } else {
        jokeEmbed.setDescription(`${data.setup}\n||${data.delivery}||`);
      }

      await interaction.editReply({ embeds: [jokeEmbed] });
    } catch (error) {
      console.error('Error fetching joke:', error);
      const errorEmbed = new EmbedBuilder()
        .setColor(color)
        .setTitle('🚨 Error 🚨')
        .setDescription('Failed to fetch a joke. Please try again later.')
        .setFooter({ text: 'Error fetching joke' });
      await interaction.editReply({ embeds: [errorEmbed] });
    }
  },
};