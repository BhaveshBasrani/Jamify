const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'removequeue',
    description: 'Removes a song from the queue.',
    category: 'music',
    async execute(message, args) {
        const queue = message.client.player.nodes.get(message.guild.id);

        if (!queue || !queue.playing) {
            return message.reply('No music is being played!');
        }

        const index = parseInt(args[0]);
        if (isNaN(index) || index < 1 || index > queue.tracks.length) {
            return message.reply('Please provide a valid track number.');
        }

        const track = queue.tracks[index - 1];
        queue.remove(track);

        const embed = new EmbedBuilder()
            .setTitle('Song Removed from Queue')
            .setImage('https://cdn.discordapp.com/attachments/1083025959659245578/1255924342836170782/standard.gif?ex=667ee631&is=667d94b1&hm=df73dbc902c6b853b57e7f324244e272bda2a84c471d7a2e567f698e68326e35&')
            .setDescription(`[${track.title}](${track.url}) has been removed from the queue.`)
            .setColor('Red')
            .setFooter({ text: '© 2024 Jamify All rights reserved.'});

        message.channel.send({ embeds: [embed] });
    },
};
