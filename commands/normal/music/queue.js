const { EmbedBuilder } = require('discord.js');
const { Player } = require('discord-player');

module.exports = {
    name: 'queue',
    description: 'Displays the current queue.',
    category: 'music',
    async execute(message) {
        const player = Player.get(message.guild.id);
        if (!player || !player.queue.size) {
            return message.channel.send('No more songs in the queue!');
        }

        const tracks = player.queue.map((track, index) => `${index + 1}. ${track.title} - ${track.requestedBy}`);
        const queueString = tracks.join('\n');

        const embed = new EmbedBuilder()
            .setTitle('Current Queue')
            .setImage(banner)
            .setDescription(queueString || 'No more songs in the queue!')
            .setColor('Green')
            .setFooter({ text: footer, iconURL: logo});

        message.channel.send({ embeds: [embed] });
    },
};