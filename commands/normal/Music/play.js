const { QueryType, useMainPlayer, useQueue } = require('discord-player');
const { EmbedBuilder } = require('discord.js');
const { logo, footer, color } = require('../../../config.json');
const ServerSettings = require('../../../models/ServerSettings');

module.exports = {
    name: 'play',
    description: 'Plays a song. (Only Supports Spotify Links!)',
    category: 'Music',
    aliases: ['p', 'pl'],
    async execute(message, args) {
        const player = useMainPlayer();
        const query = args.join(' ');

        if (!query) {
            const embed = new EmbedBuilder()
                .setTitle('❌ Error')
                .setDescription('Please provide a song to play.')
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
            console.error('Error in play command:', error);
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

        let queue = useQueue(message.guild.id);

        if (!queue) {
            try {
                queue = player.nodes.create(message.guild, {
                    metadata: {
                        channel: message.channel
                    }
                });
            } catch (error) {
                console.error('Error in play command:', error);
                const embed = new EmbedBuilder()
                    .setTitle('❌ Error')
                    .setDescription('Could not create a queue! Please make sure I have the necessary permissions.')
                    .setColor(color)
                    .setAuthor({ name: 'Jamify', iconURL: logo })
                    .setFooter({ text: footer });
                return message.reply({ embeds: [embed] });
            }
        }

        const serverSettings = await ServerSettings.findOne({ guildId: message.guild.id });

        if (!message.member.voice.channel) {
            const embed = new EmbedBuilder()
            .setTitle('❌ Error')
            .setDescription('You need to be in a voice channel to play music.')
            .setColor(color)
            .setAuthor({ name: 'Jamify', iconURL: logo })
            .setFooter({ text: footer });
            return message.reply({ embeds: [embed] });
        }

        if (serverSettings && serverSettings.twentyFourSeven) {
            const voiceChannel = message.guild.channels.cache.get(serverSettings.voiceChannelId);
            if (voiceChannel && message.member.voice.channel.id !== voiceChannel.id) {
            const embed = new EmbedBuilder()
                .setTitle('❌ Error')
                .setDescription(`24/7 mode is enabled. Please join ${voiceChannel.name}.`)
                .setColor(color)
                .setAuthor({ name: 'Jamify', iconURL: logo })
                .setFooter({ text: footer });
            return message.reply({ embeds: [embed] });
            } else if (voiceChannel && message.member.voice.channel.id === voiceChannel.id) {
            if (!queue.connection) {
                queue.connect(voiceChannel);
            }
            }
        } else {
            const voiceChannel = message.member.voice.channel;
            if (voiceChannel) {
            queue.connect(voiceChannel);
            } else {
            const embed = new EmbedBuilder()
                .setTitle('❌ Error')
                .setDescription('You need to be in a voice channel to play music.')
                .setColor(color)
                .setAuthor({ name: 'Jamify', iconURL: logo })
                .setFooter({ text: footer });
            return message.reply({ embeds: [embed] });
            }
        }

        const entry = queue.tasksQueue.acquire();

        try {

            await entry.getTask();

            if(result.hasPlaylist()) {
                queue.addTrack(result.playlist);
            } else {
                queue.addTrack(result.tracks[0])
            }

            if (!queue.isPlaying()) await queue.node.play();
        } catch (error) {
            console.error('Error in play command:', error);
            const embed = new EmbedBuilder()
                .setTitle('❌ Error')
                .setDescription('An error occurred while trying to play the song.')
                .setColor(color)
                .setAuthor({ name: 'Jamify', iconURL: logo })
                .setFooter({ text: footer });
            return message.reply({ embeds: [embed] });
        } finally {
            queue.tasksQueue.release();
        }

    }
};