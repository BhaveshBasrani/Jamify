const { QueryType, useMainPlayer, useQueue } = require('discord-player');
const { EmbedBuilder } = require('discord.js');
const { logo, banner, footer, color } = require('../../../config.json');

module.exports = {
    name: 'addqueue',
    description: 'Adds a song to the queue.',
    category: 'Music',
    aliases: ['aq', 'addq', 'enqueue'],
    async execute(message, args) {
        const player = useMainPlayer();
        const query = args.join(' ');

        if (!query) {
            const embed = new EmbedBuilder()
                .setTitle('❌ Error')
                .setDescription('Please provide a song to add to the queue.')
                .setColor(color)
                .setAuthor({ name: 'Jamify', iconURL: logo })
                .setFooter({ text: footer });
            return message.reply({ embeds: [embed] });
        }

        const queue = useQueue(message.guild.id);
        if (!queue) {
            const embed = new EmbedBuilder()
                .setTitle('❌ Error')
                .setDescription('No queue found for this guild.')
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
            console.error('Error in addqueue command:', error);
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

        const track = result.tracks[0];
        
        if(result.hasPlaylist()) {
            queue.addTrack(result.playlist);
        } else {
            queue.addTrack(track)
        }

        const embed = new EmbedBuilder()
            .setTitle('Song Added to Queue')
            .setDescription(`${track.title} has been added to the queue.`)
            .setColor(color)
            .addFields(
                {
                    name: '**Position in Queue**',
                    value: `${queue.tracks.toArray().indexOf(track) + 1} of ${queue.tracks.size()}`,
                    inline: true,
                },
                {
                    name: '**Duration**',
                    value: `${track.duration}`,
                    inline: true,
                },
                {
                    name: '**Requested By**',
                    value: `${message.author.username}`,
                    inline: true,
                }
            )
            .setThumbnail(track.thumbnail)
            .setImage(banner)
            .setFooter({ text: footer, iconURL: logo });

        message.channel.send({ embeds: [embed] });
    },
};