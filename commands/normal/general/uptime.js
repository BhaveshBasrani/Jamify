const { EmbedBuilder } = require('discord.js');
const { logo, banner, footer } = require('../../../config.json')

module.exports = {
    name: 'uptime',
    description: 'Shows bot\'s uptime.',
    category: 'general',
    execute(message) {
        console.log('Executing command: uptime');
        const totalSeconds = (message.client.uptime / 1000);
        const days = Math.floor(totalSeconds / 86400);
        const hours = Math.floor(totalSeconds / 3600) % 24;
        const minutes = Math.floor(totalSeconds / 60) % 60;
        const seconds = Math.floor(totalSeconds % 60);

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
            .setImage( banner )
            .setFooter({ text: footer, iconURL: logo });

        message.channel.send({ embeds: [embed] });
    },
};
