const { SlashCommandBuilder } = require('@discordjs/builders');
const fetch = require('node-fetch');

module.exports = {
  data: new SlashCommandBuilder()
      .setName('joke')
      .setDescription('Tells a random, clean joke.'),
  async execute(interaction) {
    console.log('Executing slash command: joke');
    try {
      const response = await fetch('https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw');
      const data = await response.json();
      console.log('Joke fetched successfully');

      // Check if it's a single joke or a two-part setup/delivery
      if (data.type === 'single') {
        await interaction.reply(data.joke);
      } else {
        await interaction.reply(`${data.setup}\n||${data.delivery}||`); // Use markdown spoiler tags for punchline
      }
    } catch (error) {
      console.error('Error fetching joke:', error);
      await interaction.reply('Failed to fetch a joke. Please try again later.');
    }
  },
};
