const { EmbedBuilder } = require('discord.js');
const { banner, logo, footer } = require('../../../config.json')

module.exports = {
    name: 'roll',
    description: 'Rolls a dice.',
    category: 'fun',
    async execute(message) {
        const sides = 6;
        const result = Math.floor(Math.random() * sides) + 1;

        const embed = new EmbedBuilder()
            .setTitle('Dice Roll')
            .setDescription(`You rolled a ${result}!`)
            .setColor('Purple')
            .setImage(banner)
            .setFooter({ text: footer, iconUrl: logo });

        message.channel.send({ embeds: [embed] });
    },
};
