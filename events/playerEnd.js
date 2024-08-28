const { EmbedBuilder } = require('discord.js');
const { banner, logo, footer } = require('../config.json');

module.exports = {
    name: 'playerEnd',
    async execute(queue) {
        console.log('queueEnd event triggered'); // Debug log

        if (queue.tracks.length > 0) {
            console.log('Playing next song in queue...');
            queue.node.play(queue.tracks[0]);
        } else {
            const embed = new EmbedBuilder()
                .setTitle('Thank You!')
                .setDescription('Thank you for using Jamify! 🎶')
                .setColor('Blue')
                .setImage(banner)
                .setFooter({ text: footer, iconURL: logo });

            console.log('queue.metadata.channel:', queue.metadata.channel);
            if (queue.metadata.channel) {
                console.log('Sending embed to channel:', queue.metadata.channel.id); // Debug log
                await queue.metadata.channel.send({ embeds: [embed] })
                    .then(() => console.log('Embed sent successfully'))
                    .catch((error) => console.error('Error sending embed:', error));
            } else {
                console.error('queue.metadata.channel is null or undefined');
            }

            queue.destroy();
            console.log('Queue destroyed'); // Debug log
        }
    },
};