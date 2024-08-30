const { QueryType, useMainPlayer, useQueue } = require('discord-player');
const { EmbedBuilder } = require('discord.js');
const { logo, banner, footer } = require('../../../config.json');

module.exports = {
    name: 'addqueue',
    description: 'Adds a song to the queue.',
    category: 'music',
    async execute(message, args) {
        const player = useMainPlayer();
        const query = args.join(' ');
        if (!query) {
            return message.reply('Please provide a song to add to the queue.');
        }

        const queue = useQueue(message.guild.id);
        if (!queue) {
            return message.reply('No queue found for this guild.');
        }

        let result;
        try {
            result = await player.search(query, {
                requestedBy: message.author,
                searchEngine: QueryType.SPOTIFY_SEARCH,
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
            duration: track.duration,
            requestedBy: message.author.username,
            channelId: message.channel.id,
            voiceChannelId: message.member.voice.channel.id
        };

        queue.insertTrack(track, queue.tracks.length);

        const embed = new EmbedBuilder()
            .setTitle('Song Added to Queue')
            .setDescription(`${track.title} has been added to the queue.`)
            .setColor('Blue')
            .addFields({
                name: '**Position in Queue**',
                value: `${queue.tracks.indexOf(track) + 1} of ${queue.tracks.length}`,
                inline: true,
              },
              {
                name: '**Duration**',
                value: `${track.duration}`,
                inline: true,
              },
              {
                name: '**Requested By**',
                value: `${song.requestedBy}`,
                inline: true,
              })
            .setThumbnail(track.thumbnail)
            .setImage(banner)
            .setFooter({ text: footer, iconURL: logo });
        message.channel.send({ embeds: [embed] });
    },
}