const { EmbedBuilder } = require('discord.js');
const { banner, logo, footer } = require('../config.json');

module.exports = (client) => {
  client.player.on('queueEnd', (queue) => {
    console.log('queueEnd event triggered'); // Debug log

    const embed = new EmbedBuilder()
      .setTitle('Thank You!')
      .setDescription('Thank you for using Jamify! 🎶')
      .setColor('Blue')
      .setImage(banner)
      .setFooter({ text: footer, iconURL: logo });

    console.log('queue.player.metadata:', queue.metadata.channel);
    if (queue.metadata.channel) {
      console.log('Sending embed to channel:', queue.metadata.channel.id); // Debug log
      queue.metadata.channel.send({ embeds: [embed] })
        .then(() => console.log('Embed sent successfully'))
        .catch((error) => console.error('Error sending embed:', error));
    } else {
      console.error('player.metadata.channel is null or undefined');
    }

    queue.destroy();
    console.log('Queue destroyed'); // Debug log
  });
};