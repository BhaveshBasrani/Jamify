const { EmbedBuilder } = require('discord.js');
const { logo, banner, footer } = require('../../../config.json');

module.exports = {
  name: 'uptime',
  description: 'Shows bot\'s uptime.',
  category: 'general',
  aliases: ['up','time']
  async execute(message) {

    let totalSeconds = Math.floor(message.client.uptime / 1000);
    let days = Math.floor(totalSeconds / 86400);
    let hours = Math.floor(totalSeconds / 3600) % 24;
    let minutes = Math.floor(totalSeconds / 60) % 60;
    let seconds = Math.floor(totalSeconds % 60);

    const embed = new EmbedBuilder()
      .setTitle('Bot Uptime')
      .setDescription(`The bot has been running for:`)
      .addFields(
        { name: 'Days', value: `${days}`, inline: true },
        { name: 'Hours', value: `${hours}`, inline: true },
        { name: 'Minutes', value: `${minutes}`, inline: true },
        { name: 'Seconds', value: `${seconds}`, inline: true }
      )
      .setColor('#00AAFF')
      .setTimestamp()
      .setImage(banner)
      .setFooter({ text: footer, iconURL: logo });

    const msg = await message.channel.send({ embeds: [embed] });

    setInterval(async () => {
      totalSeconds = Math.floor(message.client.uptime / 1000);
      days = Math.floor(totalSeconds / 86400);
      hours = Math.floor(totalSeconds / 3600) % 24;
      minutes = Math.floor(totalSeconds / 60) % 60;
      seconds = Math.floor(totalSeconds % 60);

      embed.data.fields[0].value = `${days}`;
      embed.data.fields[1].value = `${hours}`;
      embed.data.fields[2].value = `${minutes}`;
      embed.data.fields[3].value = `${seconds}`;

      await msg.edit({ embeds: [embed] });
    }, 1000); // update every 1 second
  },
};