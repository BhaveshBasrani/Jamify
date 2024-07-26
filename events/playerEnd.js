const Queue = require('../models/queue.js'); // Adjust the path as needed
const { EmbedBuilder } = require('discord.js');
const { footer, logo } = require('../config.json');

module.exports = (client) => {
  client.player.on('end', async (queue) => {
    const guildQueue = await Queue.findOne({ guildId: queue.guild.id });
    if (guildQueue && guildQueue.songs.length > 0) {
      // Remove the finished song from the queue
      guildQueue.songs.shift();
      await guildQueue.save();

      // Check if there are more songs to play
      if (guildQueue.songs.length > 0) {
        const nextSong = guildQueue.songs[0];
        queue.node.play(nextSong.url);
      } else {
        const finishedEmbed = new EmbedBuilder()
          .setTitle('Queue Finished')
          .setAuthor({ name: 'Jamify', iconURL: logo })
          .setDescription('The music queue has ended.')
          .setColor('Blue')
          .setFooter({ text: footer, iconURL: logo });
          queue.metadata.channel.send({ embeds: [finishedEmbed] });
      }
      if (queue.metadata.channel) {
        queue.metadata.channel.send({ embeds: [finishedEmbed] });
      } else {
        console.error('No channel object found in queue metadata');
      }
    }
  });
};