const { EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');
const { logo, banner, footer } = require('../../../config.json')

module.exports = {
    name: 'lyrics',
    description: 'Fetches lyrics for the currently playing song.',
    category: 'music',
    async execute(message) {
        const queue = message.client.player.nodes.get(message.guild.id);

        if (!queue || !queue.playing) {
            const errorEmbed = new EmbedBuilder()
                .setTitle('Error')
                .setDescription('No music is being played!')
                .setColor('Red')
                .setFooter({ text: footer, iconURL: logo });

            return message.channel.send({ embeds: [errorEmbed] });
        }

        const track = queue.current;
        const response = await fetch(`https://api.lyrics.ovh/v1/${track.author}/${track.title}`);
        const data = await response.json();

        if (!data.lyrics) {
            const errorEmbed = new EmbedBuilder()
                .setTitle('Error')
                .setDescription('No lyrics found for this song!')
                .setColor('Red')
                .setFooter({ text: footer, iconURL: logo });

            return message.channel.send({ embeds: [errorEmbed] });
        }

        const embed = new EmbedBuilder()
            .setTitle(`Lyrics for ${track.title}`)
            .setImage(banner)
            .setDescription(data.lyrics)
            .setColor('Green')
            .setFooter({ text: footer, iconURL: logo });

        message.channel.send({ embeds: [embed] });
    },
};