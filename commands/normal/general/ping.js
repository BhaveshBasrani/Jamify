const { EmbedBuilder } = require('discord.js');
const { logo, banner, footer } = require('../../../config.json')

module.exports = {
    name: 'ping',
    description: 'Checks the bot\'s latency.',
    category: 'general',
    async execute(message) {
        const embed = new EmbedBuilder()
            .setTitle('Ping')
            .setDescription(`🏓 Latency is ${Date.now() - message.createdTimestamp}ms.`)
            .setColor('Yellow')
            .setImage( banner )
            .setFooter({ text: footer, iconURL: logo});

        message.channel.send({ embeds: [embed] });
    },
};
