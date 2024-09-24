const { EmbedBuilder } = require('discord.js');
const { banner, logo, footer } = require('../config.json');

module.exports = {
    name: 'playerFinish',
    async execute(queue) {

        if (queue.tracks.length > 0) {
            queue.node.play(queue.tracks[0]);
        } else {
            const embed = new EmbedBuilder()
                .setTitle('Thank You!')
                .setDescription('Thank you for using Jamify! 🎶')
                .setColor(color)
                .setImage(banner)
                .setFooter({ text: footer, iconURL: logo });

            if (queue.metadata.channel) {
                await queue.metadata.channel.send({ embeds: [embed] })
                    .catch((error) => console.error('Error sending embed:', error));
            } else {
                console.error('queue.metadata.channel is null or undefined');
            }

            queue.delete();
        }
    },
};