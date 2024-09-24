const { EmbedBuilder } = require('discord.js');
const { logo, banner, footer, color } = require('../../../config.json');

module.exports = {
    name: 'coinflip',
    description: 'Flips a coin.',
    category: 'Fun',
    aliases: ['coin', 'flip'],
    async execute(message) {
        const result = Math.random() < 0.5 ? 'Heads' : 'Tails';

        const embed = new EmbedBuilder()
            .setTitle('Coin Flip')
            .setDescription(`The coin landed on ${result}!`)
            .setColor(color)
            .setImage(banner)
            .setFooter({ text: footer, iconUrl: logo });

        message.channel.send({ embeds: [embed] });
    },
};
