const { EmbedBuilder } = require('discord.js');
const { useQueue } = require("discord-player");
const { logo, banner, footer } = require('../../../config.json');
const { useMainPlayer } = require("discord-player");

module.exports = {
    name: 'lyrics',
    description: 'Fetches lyrics for the currently playing song.',
    category: 'music',
    aliases: ['sly', 'sl'],
    async execute(message) {
        try {
            const queue = useQueue(message.guild.id);
            const player = useMainPlayer();

            if (!queue || !player) {
                const errorEmbed = new EmbedBuilder()
                    .setTitle('Error')
                    .setDescription('Player or queue is not initialized.')
                    .setColor('Red')
                    .setFooter({ text: footer, iconURL: logo });

                return message.channel.send({ embeds: [errorEmbed] });
            }

            if (!queue.isPlaying()) {
                const errorEmbed = new EmbedBuilder()
                    .setTitle('Error')
                    .setDescription('No music is being played!')
                    .setColor('Red')
                    .setFooter({ text: footer, iconURL: logo });

                return message.channel.send({ embeds: [errorEmbed] });
            }

            const track = queue.currentTrack;

            if (!track) {
                const errorEmbed = new EmbedBuilder()
                    .setTitle('Error')
                    .setDescription('No track is currently playing.')
                    .setColor('Red')
                    .setFooter({ text: footer, iconURL: logo });

                return message.channel.send({ embeds: [errorEmbed] });
            }

            const results = await player.lyrics.search({
                q: `${track.title}`
            });

            if (!results || !results[0]) {
                const errorEmbed = new EmbedBuilder()
                    .setTitle('Error')
                    .setDescription('No lyrics found for this song!')
                    .setColor('Red')
                    .setFooter({ text: footer, iconURL: logo });

                return message.channel.send({ embeds: [errorEmbed] });
            }

            const first = results[0];

            if (!first.syncedLyrics) {
                const errorEmbed = new EmbedBuilder()
                    .setTitle('Error')
                    .setDescription('No synced lyrics available for this song!')
                    .setColor('Red')
                    .setFooter({ text: footer, iconURL: logo });

                return message.channel.send({ embeds: [errorEmbed] });
            }

            const syncedLyrics = queue.syncedLyrics(first.syncedLyrics);

            if (!syncedLyrics) {
                const errorEmbed = new EmbedBuilder()
                    .setTitle('Error')
                    .setDescription('Failed to initialize synced lyrics.')
                    .setColor('Red')
                    .setFooter({ text: footer, iconURL: logo });

                return message.channel.send({ embeds: [errorEmbed] });
            }

            syncedLyrics.subscribe();

            syncedLyrics.onChange(async (lyrics, timestamp) => {
                await message.channel.send({
                    content: `[${timestamp}]: ${lyrics}`
                });
            });

            // Send initial lyrics
            const initialLyrics = syncedLyrics.at(0);
            if (initialLyrics) {
                await message.channel.send({
                    content: `[0]: ${initialLyrics}`
                });
            }
        } catch (error) {
            console.error('Error in lyrics command:', error);
            const errorEmbed = new EmbedBuilder()
                .setTitle('Error')
                .setDescription('An error occurred while fetching lyrics.')
                .setColor('Red')
                .setFooter({ text: footer, iconURL: logo });

            return message.channel.send({ embeds: [errorEmbed] });
        }
    },
};