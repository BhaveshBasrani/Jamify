const { EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const Queue = require('../../../models/queue.js');
const { banner, logo, footer } = require('../../../config.json');

module.exports = {
  name: 'skip',
  description: 'Skips the current song.',
  category: 'music',
  async execute(message) {
    const queue = useQueue(message.guild.id);
    const customQueue = await Queue.findOne({ guildId: message.guild.id });

    if (!queue || !queue.tracks.length) {
      return message.channel.send('No more songs in the queue!');
    }

    const currentTrack = queue.currentTrack;
    queue.node.skip();

    // Update your custom queue model as needed
    if (customQueue) {
      customQueue.tracks.shift();
      await customQueue.save();
    }

    const embed = new EmbedBuilder()
      .setTitle('Song Skipped')
      .setAuthor({name: 'Jamify', iconURL:logo})
      .setImage(banner)
      .setDescription(`Skipped **${currentTrack.title}** By **${currentTrack.author}**`)
      .setColor('Yellow')
      .setFooter({ text: footer, iconURL: logo });

    message.channel.send({ embeds: [embed] });
  },
};