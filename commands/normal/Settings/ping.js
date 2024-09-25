const { EmbedBuilder } = require('discord.js');
const { logo, banner, footer, color } = require('../../../config.json');

module.exports = {
  name: 'ping',
  description: 'Checks the bot\'s latency and provides additional information.',
  category: 'Settings',
  aliases: ['p', 'pin', 'pi', 'latency', 'pong', 'lag'],
  async execute(message) {
    const ping = Date.now() - message.createdTimestamp;
    const apiPing = message.client.ws.ping;

    const embed = new EmbedBuilder()
      .setTitle('🏓 Pong!')
      .addFields(
      { name: 'Latency', value: `${ping}ms 🕒`, inline: true },
      { name: 'API Latency', value: `${apiPing}ms 🌐`, inline: true }
      )
      .setColor(color)
      .setImage(banner)
      .setFooter({ text: footer, iconURL: logo })
      .setTimestamp();

    message.channel.send({ embeds: [embed] });
  },
};
