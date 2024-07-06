const { EmbedBuilder } = require('discord.js');
const Queue = require('../../../models/queue.js');
const { banner, logo, footer } = require('../../../config.json')

module.exports = {
    name: 'queue',
    description: 'Displays the current queue.',
    category: 'music',
    async execute(message) {
        const queue = await Queue.findOne({ guildId: message.guild.id });

        if (!queue || !queue.songs.length) {
            return message.channel.send('No more songs in the queue!');
        }

        const tracks = queue.songs
            .map((track, index) => `${index + 1}. ${track.title} - ${track.requestedBy}`)
            .join('\n');
            
        const embed = new EmbedBuilder()
            .setTitle('Current Queue')
            .setImage(banner)
            .setDescription(tracks || 'No more songs in the queue!')
            .setColor('Green')
            .setFooter({ text: footer, iconURL: logo});

        message.channel.send({ embeds: [embed] });
    },
};
