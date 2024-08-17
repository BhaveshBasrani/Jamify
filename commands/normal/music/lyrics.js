const { EmbedBuilder } = require('discord.js');
const { useQueue } = require("discord-player");
const { lyricsExtractor } = require('@discord-player/extractor');
const { logo, banner, footer } = require('../../../config.json')

const lyricsFinder = lyricsExtractor();

module.exports = {
    name: 'lyrics',
    description: 'Fetches lyrics for the currently playing song.',
    category: 'music',
    aliases: ['ly', 'l'],
    async execute(message) {
        const queue = useQueue(message.guild.id);

        if (!queue.isPlaying()) {
            const errorEmbed = new EmbedBuilder()
                .setTitle('Error')
                .setDescription('No music is being played!')
                .setColor('Red')
                .setFooter({ text: footer, iconURL: logo });

            return message.channel.send({ embeds: [errorEmbed] });
        }

        const track = queue.currentTrack; //Gets the current track being played
        
        const lyrics = await lyricsFinder.search(`${track.author} ${track.title}`).catch(() => null);
        if (!lyrics) {
            const errorEmbed = new EmbedBuilder()
                .setTitle('Error')
                .setDescription('No lyrics found for this song!')
                .setColor('Red')
                .setFooter({ text: footer, iconURL: logo });

            return message.channel.send({ embeds: [errorEmbed] });
        }

        const embed = new EmbedBuilder()
            .setTitle(lyrics.title)
            .setURL(lyrics.url)
            .setThumbnail(lyrics.thumbnail)
            .setAuthor({
                name: lyrics.artist.name,
                iconURL: lyrics.artist.image,
                url: lyrics.artist.url
            })
            .setDescription(lyrics.lyrics)
            .setColor('Random');

        message.channel.send({ embeds: [embed] });
    },
};