const { SlashCommandBuilder } = require('@discordjs/builders'); // Assuming you're using Slash Commands
const fetch = require('node-fetch');
const { useMainPlayer } = require("discord-player");

module.exports = {
  data: new SlashCommandBuilder()
      .setName('lyrics')
      .setDescription('Displays the lyrics of the current song.'),
  async execute(interaction, client) {
    console.log('Executing command: lyrics');
    const player = useMainPlayer();
    const queue = player.nodes.get(interaction.guildId);
    if (!queue || !queue.playing) return interaction.reply('There is no music playing!');

    const currentTrack = queue.current;
    const query = `${currentTrack.title} ${currentTrack.author}`;
    const url = `https://api.lyrics.ovh/v1/${currentTrack.author}/${currentTrack.title}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      interaction.reply(`**Lyrics for ${currentTrack.title} by ${currentTrack.author}:**\n\n${data.lyrics}`);
    } catch (error) {
      console.error('Error fetching lyrics:', error);
      interaction.reply('Could not fetch lyrics for the current song.');
    }
  },
};
