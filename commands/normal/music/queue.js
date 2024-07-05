const { EmbedBuilder } = require('discord.js');
const Queue = require('../../../models/queue.js'); // Adjust the path as needed

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
            .setImage('https://cdn.discordapp.com/attachments/1083025959659245578/1255924342836170782/standard.gif?ex=667ee631&is=667d94b1&hm=df73dbc902c6b853b57e7f324244e272bda2a84c471d7a2e567f698e68326e35&')
            .setDescription(tracks || 'No more songs in the queue!')
            .setColor('Green')
            .setFooter({ text: '© 2024 Jamify All rights reserved.'});

        message.channel.send({ embeds: [embed] });
    },
};
