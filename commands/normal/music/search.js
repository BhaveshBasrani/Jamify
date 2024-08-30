const { QueryType, useMainPlayer } = require('discord-player');
const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { banner, logo, footer } = require('../../../config.json')

module.exports = {
    name: 'search',
    description: 'Searches for a song.',
    category: 'music',
    aliases: ['sear', 'ser' , 'se'],
    async execute(message, args) {
        const player = useMainPlayer();
        const query = args.join(' ');
        
        if (!query) {
            return message.reply('Please provide a song to search for.');
        }

        const result = await player.search(query, {
            requestedBy: message.author,
            searchEngine: QueryType.SPOTIFY_SEARCH,
        });

        if (!result || !result.tracks.length) {
            return message.reply(`No results found for ${query}!`);
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
            .setColor('Blue')
            .setImage(banner)
            .setFooter({ text: footer, iconURL: logo});

        const msg = await message.channel.send({ embeds: [embed], components: [row] });

        const filter = i => i.customId === 'select-track' && i.user.id === message.author.id  ;
        const collector = msg.createMessageComponentCollector({ filter, time: 60000 });

        collector.on('collect', async i => {
            await i.deferReply(); // Defer the reply to give more time
        
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
                    console.error(error);
                    return message.reply('Could not join your voice channel! Please make sure I have the necessary permissions.');
                }
            }
        
            queue.addTrack(track);
        
            if (!queue.isPlaying()) {
                await queue.play(track); // Play the track
            }
        
            const nowPlayingEmbed = new EmbedBuilder()
            .setTitle('Now Playing')
            .setAuthor({ name: 'Jamify', iconURL: logo })
            .setDescription(`**${track.title}** by **${track.author}**`)
            .setColor('Blue')
            .setThumbnail(track.thumbnail)
            .setImage(banner)
            .setFooter({ text: footer })
            .addFields(
              { name: 'Duration', value: `${track.duration}`, inline: true },
              { name: 'Search Query', value: `${query}`, inline: true },
              { name: 'Requested By', value: `@${message.author.tag}`, inline: true }
            );
        
            await i.editReply({ embeds: [nowPlayingEmbed], components: [] }); // Update after selection
        });
    }
};
