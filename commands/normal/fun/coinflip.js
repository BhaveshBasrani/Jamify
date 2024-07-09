const { EmbedBuilder } = require('discord.js');
const { banner, logo, footer } = require('../../../config.json')

module.exports = {
    name: 'coinflip',
    description: 'Flips a coin.',
    category: 'fun',
    aliases: ['coin', 'flip'],
    async execute(message) {
        const result = Math.random() < 0.5 ? 'Heads' : 'Tails';

        const embed = new EmbedBuilder()
            .setTitle('Coin Flip')
            .setDescription(`The coin landed on ${result}!`)
            .setColor('Orange')
            .setImage(banner)
            .setFooter({ text: footer, iconUrl: logo });

        message.channel.send({ embeds: [embed] });
    },
};
