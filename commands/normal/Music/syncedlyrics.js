const { EmbedBuilder } = require('discord.js');
const { logo, footer, color, banner } = require('../../../config.json');
const { useMainPlayer, useQueue } = require("discord-player");

module.exports = {
    name: 'syncedlyrics',
    description: 'Fetches the synced lyrics for the currently playing song.',
    category: 'Music',
    aliases: ['sly', 'sl'],
    async execute(message) {
        try {
            const queue = useQueue(message.guild.id);
           const player = useMainPlayer()
            if (!player) {
                const errorEmbed = new EmbedBuilder()
                    .setTitle('Error')
                    .setDescription('Player or queue is not initialized.')
                    .setColor(color)
                    .setFooter({ text: footer, iconURL: logo });

                return message.channel.send({ embeds: [errorEmbed] });
            }

            if (!queue.isPlaying()) {
                const errorEmbed = new EmbedBuilder()
                    .setTitle('Error')
                    .setDescription('No music is being played!')
                    .setColor(color)
                    .setFooter({ text: footer, iconURL: logo });

                return message.channel.send({ embeds: [errorEmbed] });
            }

            const track = queue.currentTrack;

            if (!track) {
                const errorEmbed = new EmbedBuilder()
                    .setTitle('Error')
                    .setDescription('No track is currently playing.')
                    .setColor(color)
                    .setFooter({ text: footer, iconURL: logo });

                return message.channel.send({ embeds: [errorEmbed] });
            }

            const results = await player.lyrics.search({
                q: `${track.title} ${track.author}`
            });

            if (!results) {
                const errorEmbed = new EmbedBuilder()
                    .setTitle('Error')
                    .setDescription('No lyrics found for this song!')
                    .setColor(color)
                    .setFooter({ text: footer, iconURL: logo });

                return message.channel.send({ embeds: [errorEmbed] });
            }

            const first = results[0];
            if (!first || !first.syncedLyrics) {
                const errorEmbed = new EmbedBuilder()
                    .setTitle('Error')
                    .setDescription('No synced lyrics available for this song!')
                    .setColor(color)
                    .setFooter({ text: footer, iconURL: logo });

                return message.channel.send({ embeds: [errorEmbed] });
            }

            const syncedLyrics = queue.syncedLyrics(first);

            if (!syncedLyrics) {
                const errorEmbed = new EmbedBuilder()
                    .setTitle('Error')
                    .setDescription('Failed to initialize synced lyrics.')
                    .setColor(color)
                    .setFooter({ text: footer, iconURL: logo });

                return message.channel.send({ embeds: [errorEmbed] });
            }

            const lyricsEmbed = new EmbedBuilder()
                .setTitle(`**Live** Lyrics for ${track.title} by ${track.author}`)
                .setColor(color)
                .setFooter({ text: footer, iconURL: logo });

            const sentMessage = await message.channel.send({ embeds: [lyricsEmbed] });

            syncedLyrics.onChange(async (lyrics) => {
                lyricsEmbed.setDescription(`[${lyrics}`);
                await sentMessage.edit({ embeds: [lyricsEmbed] });
            });
            syncedLyrics.subscribe();

            // Send initial lyrics
            const initialLyrics = syncedLyrics.at(0);
            if (initialLyrics) {
                lyricsEmbed.setDescription(`${initialLyrics}`);
                await sentMessage.edit({ embeds: [lyricsEmbed] });
            }
        } catch (error) {
            console.error('Error in lyrics command:', error);
            const errorEmbed = new EmbedBuilder()
                .setTitle('Error')
                .setDescription('An error occurred while fetching lyrics.')
                .setColor(color)
                .setFooter({ text: footer, iconURL: logo });

            return message.channel.send({ embeds: [errorEmbed] });
        }
    },
};