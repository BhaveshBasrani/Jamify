const { QueryType } = require('discord-player');
const { EmbedBuilder } = require('discord.js');
const Queue = require('../../../models/queue.js'); // Adjust the path as needed

module.exports = {
    name: 'play',
    description: 'Plays a song from Spotify.',
    category: 'music',
    async execute(message, args) {
        const query = args.join(' ');
        if (!query) {
            return message.reply('Please provide a song to play.');
        }

        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) {
            return message.reply('You need to be in a voice channel to play music!');
        }

        await Queue.deleteOne({ guildId: message.guild.id });

        let queue = new Queue({ guildId: message.guild.id, songs: [] });

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
            voiceChannelId: voiceChannel.id
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
                await node.connect(voiceChannel);
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
            .setTitle('Now Playing')
            .setDescription(`${track.title}`)
            .setColor('Blue')
            .setThumbnail(track.thumbnail)
            .setImage('https://cdn.discordapp.com/attachments/1083025959659245578/1255924342836170782/standard.gif?ex=667ee631&is=667d94b1&hm=df73dbc902c6b853b57e7f324244e272bda2a84c471d7a2e567f698e68326e35&')
            .setFooter({ text: '© 2024 Jamify All rights reserved.', iconURL: 'https://cdn.discordapp.com/attachments/1083025959659245578/1256226568997703790/e2e7d7f843961fdb91063a5dac128ccb.png?ex=667fffa9&is=667eae29&hm=17f714a7058d5c68e731d76e12fafa94cce4af9d0a2992ad4fad2a5b47af464c&' });

        message.channel.send({ embeds: [embed] });
    },
};
