const { EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    name: 'lyrics',
    description: 'Fetches lyrics for the currently playing song.',
    category: 'music',
    async execute(message) {
        const queue = message.client.player.nodes.get(message.guild.id);

        if (!queue || !queue.playing) {
            return message.reply('No music is being played!');
        }

        const track = queue.current;
        const response = await fetch(`https://api.lyrics.ovh/v1/${track.author}/${track.title}`);
        const data = await response.json();

        if (!data.lyrics) {
            return message.reply('No lyrics found for this song!');
        }

        const embed = new EmbedBuilder()
            .setTitle(`Lyrics for ${track.title}`)
            .setImage('https://cdn.discordapp.com/attachments/1083025959659245578/1255924342836170782/standard.gif?ex=667ee631&is=667d94b1&hm=df73dbc902c6b853b57e7f324244e272bda2a84c471d7a2e567f698e68326e35&')
            .setDescription(data.lyrics)
            .setColor('Green')
            .setFooter({ text: '© 2024 Jamify All rights reserved.'});

        message.channel.send({ embeds: [embed] });
    },
};
