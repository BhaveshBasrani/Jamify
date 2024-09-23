const { EmbedBuilder } = require('discord.js');
const { logo, banner, footer } = require('../../../config.json');

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
      .setDescription(`**Latency:** ${ping}ms 🕒\n**API Latency:** ${apiPing}ms 🌐`)
      .setColor('Yellow')
      .setImage(banner)
      .addFields(
      { name: 'Server', value: message.guild.name, inline: true },
      { name: 'Server Region', value: message.guild.region, inline: true },
      { name: 'User', value: message.author.tag, inline: true },
      { name: 'User ID', value: message.author.id, inline: true }
      )
      .setFooter({ text: footer, iconURL: logo })
      .setTimestamp();

    message.channel.send({ embeds: [embed] });
  },
};