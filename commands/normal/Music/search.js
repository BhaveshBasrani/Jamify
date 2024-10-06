const { QueryType, useMainPlayer } = require('discord-player');
const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { logo, banner, footer, color } = require('../../../config.json');

module.exports = {
    name: 'search',
    description: 'Searches for a song.',
    category: 'Music',
    aliases: ['sear', 'ser', 'se'],
    async execute(message, args) {
        const player = useMainPlayer();
        const query = args.join(' ');

        if (!query) {
            const embed = new EmbedBuilder()
                .setTitle('❌ Error')
                .setDescription('Please provide a song to search for.')
                .setColor(color)
                .setAuthor({ name: 'Jamify', iconURL: logo })
                .setFooter({ text: footer });
            return message.reply({ embeds: [embed] });
        }

        let result;
        try {
            result = await player.search(query, {
                requestedBy: message.author,
                searchEngine: QueryType.SPOTIFY_SEARCH,
            });
        } catch (error) {
            console.error('Error in search command:', error);
            const embed = new EmbedBuilder()
                .setTitle('❌ Error')
                .setDescription('An error occurred while searching for the song.')
                .setColor(color)
                .setAuthor({ name: 'Jamify', iconURL: logo })
                .setFooter({ text: footer });
            return message.reply({ embeds: [embed] });
        }

        if (!result || !result.tracks.length) {
            const embed = new EmbedBuilder()
                .setTitle('❌ Error')
                .setDescription(`No results found for ${query}!`)
                .setColor(color)
                .setAuthor({ name: 'Jamify', iconURL: logo })
                .setFooter({ text: footer });
            return message.reply({ embeds: [embed] });
        }

        const tracks = result.tracks.slice(0, 5);
        const options = tracks.map((track, index) => ({
            label: track.title,
            description: track.author,
            value: index.toString(),
        }));

        const row = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('select-track')
                    .setPlaceholder('Select a track to play')
                    .addOptions(options),
            );

        const embed = new EmbedBuilder()
            .setTitle('Search Results')
            .setDescription(tracks.map((track, index) => `${index + 1}. ${track.title}`).join('\n'))
            .setColor(color)
            .setImage(banner)
            .setFooter({ text: footer, iconURL: logo });

        const msg = await message.channel.send({ embeds: [embed], components: [row] });

        const filter = i => i.customId === 'select-track' && i.user.id === message.author.id;
        const collector = msg.createMessageComponentCollector({ filter, time: 60000 });

        collector.on('collect', async i => {
            await i.deferReply();

            const trackIndex = parseInt(i.values[0]);
            const track = tracks[trackIndex];

            let queue = player.nodes.get(message.guild.id);

            if (!queue) {
                try {
                    queue = player.nodes.create(message.guild, {
                        metadata: {
                            channel: message.channel
                        }
                    });
                    await queue.connect(message.member.voice.channel);
                } catch (error) {
                    console.error('Error in search command:', error);
                    const embed = new EmbedBuilder()
                        .setTitle('❌ Error')
                        .setDescription('Could not join your voice channel! Please make sure I have the necessary permissions.')
                        .setColor(color)
                        .setAuthor({ name: 'Jamify', iconURL: logo })
                        .setFooter({ text: footer });
                    return message.reply({ embeds: [embed] });
                }
            }

            if(result.hasPlaylist()) {
                queue.addTrack(result.playlist);
            } else {
                queue.addTrack(track)
            }

            if (!queue.isPlaying()) {
                await queue.node.play();
            }

            await i.editReply({ content: `**${track.title}** by **${track.author}** is now playing!`, components: [] });
        });
    }
};