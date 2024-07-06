const { QueryType } = require('discord-player');
const { EmbedBuilder } = require('discord.js');
const Queue = require('../../../models/queue.js'); // Adjust the path as needed
const { logo, banner, footer } = require('../../../config.json')

module.exports = {
    name: 'addqueue',
    description: 'Adds a song to the queue.',
    category: 'music',
    async execute(message, args) {
        const query = args.join(' ');
        if (!query) {
            return message.reply('Please provide a song to add to the queue.');
        }

        let queue = await Queue.findOne({ guildId: message.guild.id });
        if (!queue) {
            queue = new Queue({ guildId: message.guild.id, songs: [] });
        }

        let result;
        try {
            result = await message.client.player.search(query, {
                requestedBy: message.author,
                searchEngine: QueryType.AUTO,
            });
        } catch (error) {
            console.error(error);
            return message.reply('An error occurred while searching for the song.');
        }

        if (!result || !result.tracks.length) {
            return message.reply(`No results found for ${query}!`);
        }

        const track = result.tracks[0];
        const song = {
            title: track.title,
            url: track.url,
            thumbnail: track.thumbnail,
            requestedBy: message.author.username,
            channelId: message.channel.id,
            voiceChannelId: message.member.voice.channel.id
        };

        queue.songs.push(song);
        await queue.save();

        const saveCurrentState = async (guildId, currentTrack, queue) => {
            await Queue.updateOne(
                { guildId },
                { $set: { currentTrack, songs: queue.songs } },
                { upsert: true }
            );
        };
        
        let node = message.client.player.nodes.get(message.guild.id);
        if (!node) {
            try {
                node = await message.client.player.nodes.create(message.guild.id, {
                    metadata: {
                        channel: message.channel
                    }
                });
                await node.connect(message.member.voice.channel);
            } catch (error) {
                console.error(error);
                return message.reply('An error occurred while trying to connect to the voice channel.');
            }
        }
        
        if (!node.playing) {
            try {
                await node.play(track.url);
                await saveCurrentState(message.guild.id, song, queue);
            } catch (error) {
                console.error(error);
                return message.reply('An error occurred while trying to play the track.');
            }
        } else {
            node.queue.add(track.url);
        }

        const embed = new EmbedBuilder()
            .setTitle('Song Added to Queue')
            .setDescription(`${track.title} has been added to the queue.`)
            .setColor('Blue')
            .setThumbnail(track.thumbnail)
            .setFooter({ text: footer, iconURL: logo });
        message.channel.send({ embeds: [embed] });
    },
}
