const { EmbedBuilder } = require('discord.js');
const Queue = require('../../../models/queue.js'); // Adjust the path as needed

module.exports = {
    name: 'skip',
    description: 'Skips the current song.',
    category: 'music',
    async execute(message) {
        const queue = await Queue.findOne({ guildId: message.guild.id });

        if (!queue || !queue.songs.length) {
            return message.channel.send('No more songs in the queue!');
        }

        const currentTrack = queue.songs.shift();
        await queue.save();

        let node = message.client.player.nodes.get(message.guild.id);
        if (!node) {
            return message.reply('No music is being played!');
        }

        if (queue.songs.length > 0) {
            const nextTrack = queue.songs[0];
            try {
                await node.play(nextTrack.url);
            } catch (error) {
                console.error(error);
                return message.reply('An error occurred while trying to play the next track.');
            }
        } else {
            node.stop();
        }

        const embed = new EmbedBuilder()
            .setTitle('Song Skipped')
            .setImage('https://cdn.discordapp.com/attachments/1083025959659245578/1255924342836170782/standard.gif?ex=667ee631&is=667d94b1&hm=df73dbc902c6b853b57e7f324244e272bda2a84c471d7a2e567f698e68326e35&')
            .setDescription(`Skipped to the next song!`)
            .setColor('Yellow')
            .setFooter({ text: '© 2024 Jamify All rights reserved.'});

        message.channel.send({ embeds: [embed] });
    },
};
