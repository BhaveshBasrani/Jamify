const { EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { logo, banner, footer, color } = require('../../../config.json');

async function skipSong(message) {
  const queue = useQueue(message.guild.id);
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
    .setColor(color)
    .setFooter({ text: footer, iconURL: logo });

  message.reply({ embeds: [embed] });
}

module.exports = skipSong;

