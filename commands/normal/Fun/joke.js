const fetch = require('node-fetch');
const { EmbedBuilder} = require('discord.js');
const { logo, banner, footer, color } = require('../../../config.json');

module.exports = {
  name: 'joke',
  description: 'Tells a random, appropriate joke.',
  category: 'Fun',
  aliases: ['jokes'],
  async execute(message) {
    console.log('Executing command: joke');
    try {
      const response = await fetch('https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,religious,political');
      const data = await response.json();
      console.log('Joke fetched successfully.');

      // Create an embed
      const jokeEmbed = new EmbedBuilder()
        .setColor(color)
        .setAuthor({ name: 'Jamify', iconURL: logo })
        .setTitle('🤣 Joke 🤣')
        .setImage(banner)
        .setFooter({ text: footer});

      // Check if it's a single joke or a two-part setup/delivery
      if (data.type === 'single') {
        jokeEmbed.setDescription(data.joke);
      } else {
        jokeEmbed.setDescription(`${data.setup}\n||${data.delivery}||`); // Use markdown spoiler tags for punchline
      }

      message.channel.send({ embeds: [jokeEmbed] });
    } catch (error) {
      console.error('Error fetching joke:', error);
      const errorEmbed = new EmbedBuilder()
        .setColor(color)
        .setTitle('🚨 Error 🚨')
        .setDescription('Failed to fetch a joke. Please try again later.')
        .setFooter({ text: 'Error fetching joke' });
      message.channel.send({ embeds: [errorEmbed] });
    }
  },
};