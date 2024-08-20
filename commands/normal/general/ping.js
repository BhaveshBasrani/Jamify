const { EmbedBuilder } = require('discord.js');
const { logo, banner, footer } = require('../../../config.json');

module.exports = {
  name: 'ping',
  description: 'Checks the bot\'s latency and provides additional information.',
  category: 'general',
  aliases: ['p', 'pin', 'pi'],
  async execute(message) {
    const ping = Date.now() - message.createdTimestamp;
    const apiPing = message.client.ws.ping;

    const embed = new EmbedBuilder()
     .setTitle('🏓 Ping')
     .setDescription(`**Latency:** ${ping}ms`)
     .addFields(
        {
          name: '📊 **API Latency:**',
          value: `${apiPing}ms`,
          inline: true,
        },
      )
     .setColor('Yellow')
     .setImage(banner)
     .setFooter({ text: footer, iconURL: logo })
     .setTimestamp();

    message.channel.send({ embeds: [embed] });
  },
};