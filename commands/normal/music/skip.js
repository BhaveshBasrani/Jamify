const { EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { banner, logo, footer } = require('../../../config.json');

module.exports = {
  name: 'skip',
  description: 'Skips the current song.',
  category: 'music',
  async execute(message) {
    const queue = useQueue(message.guild.id);
    if (!queue || !queue.currentTrack) {
      return message.reply('No song is currently playing!');
    }

    const currentTrack = queue.currentTrack;

    queue.node.skip();

    const embed = new EmbedBuilder()
      .setTitle('Song Skipped')
      .setAuthor({ name: 'Jamify', iconURL: logo })
      .setImage(banner)
      .setDescription(`Skipped **${currentTrack.title}** by **${currentTrack.author}**`)
      .addFields(
        { name: 'Skipped By', value: message.author.id, inline: true },
        { name: 'Next Song', value: queue.tracks[0] ? queue.tracks[0].title : 'None', inline: true }
      )
      .setColor('Yellow')
      .setFooter({ text: footer, iconURL: logo });

      message.reply({ embeds: [embed] });
  },
};