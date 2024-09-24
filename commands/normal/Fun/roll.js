const { EmbedBuilder } = require('discord.js');
const { logo, banner, footer, color } = require('../../../config.json');

module.exports = {
    name: 'roll',
    description: 'Rolls a dice.',
    category: 'Fun',
    aliases: ['dice', 'roll'],
    async execute(message) {
        const sides = 6;
        const result = Math.floor(Math.random() * sides) + 1;

        const embed = new EmbedBuilder()
            .setTitle('Dice Roll')
            .setDescription(`You rolled a ${result}!`)
            .setColor(color)
            .setImage(banner)
            .setFooter({ text: footer, iconUrl: logo });

        message.channel.send({ embeds: [embed] });
    },
};
