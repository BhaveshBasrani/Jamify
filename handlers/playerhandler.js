const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { logo, footer, color } = require('../config.json');
const canvafy = require('canvafy');
const pauseMusic = require('../commands/normal/Music/pause');
const stopMusic = require('../commands/normal/Music/stop');
const displayQueue = require('../commands/normal/Music/queue');
const fetchSyncedLyrics = require('../commands/normal/Music/syncedlyrics');
const skipSong = require('../commands/normal/Music/skip');
const shuffle = require('../commands/normal/Music/shuffle');
const repeat = require('../commands/normal/Music/repeat');
const toggleAutoplay = require('../commands/normal/Music/autoplay');
const resumeMusic = require('../commands/normal/Music/resume');

module.exports = {
    name: 'playerhandler',
    async execute(queue, track) {
        try {
            const spotify = await new canvafy.Spotify()
                .setAuthor(track.author)
                .setAlbum(track.album || 'Unknown Album')
                .setTimestamp(track.durationMS / 4, track.durationMS)
                .setImage(track.thumbnail)
                .setTitle(track.title)
                .setBlur(5)
                .setOverlayOpacity(0.7)
                .build();

            const buffer = Buffer.from(spotify);

            const nowPlayingEmbed = new EmbedBuilder()
                .setTitle('<a:Music_Cmds:1280034171431026749> Now Playing')
                .setDescription(`**${track.title}** By **${track.author}** \n
                    <a:BlueBulllet:1290900684618596382> __**Duration:**__ ${track.duration || 'Unknown Duration'} \n
                    <a:BlueBulllet:1290900684618596382> __**Requested By:**__ <@${track.requestedBy.id}> \n
                    <a:BlueBulllet:1290900684618596382> __**Views:**__ ${track.views || 'Unknown Album'}`)
                .setColor(color)
                .setImage('attachment://spotify.png')
                .setFooter({ text: footer, iconURL: logo })
                .setTimestamp();

            const selectMenu = new ActionRowBuilder()
                .addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId('music_controls')
                        .setPlaceholder('🎵 Select an action')
                        .addOptions([
                            {
                                label: '⏸️ Pause',
                                description: 'Pause the music',
                                value: 'pause',
                            },
                            {
                                label: '▶️ Resume',
                                description: 'Resume the music',
                                value: 'resume',
                            },
                            {
                                label: '⏹️ Stop',
                                description: 'Stop the music',
                                value: 'stop',
                            },
                            {
                                label: '⏭️ Skip',
                                description: 'Skip the current song',
                                value: 'skip',
                            },
                            {
                                label: '📜 Queue',
                                description: 'Display the queue',
                                value: 'queue',
                            },
                            {
                                label: '🎤 Lyrics',
                                description: 'Fetch synced lyrics',
                                value: 'lyrics',
                            },
                            {
                                label: '🔀 Shuffle',
                                description: 'Shuffle the queue',
                                value: 'shuffle',
                            },
                            {
                                label: '🔁 Repeat',
                                description: 'Repeat the current song',
                                value: 'repeat',
                            },
                            {
                                label: '🔄 Autoplay',
                                description: 'Toggle autoplay',
                                value: 'autoplay',
                            }
                        ])
                );

            const messageOptions = {
                embeds: [nowPlayingEmbed],
                files: [{ attachment: buffer, name: 'spotify.png' }],
                components: [selectMenu]
            };

            const sentMessage = await queue.metadata.channel.send(messageOptions);

            const filter = i => i.user.id === track.requestedBy.id;
            const collector = sentMessage.createMessageComponentCollector({ filter, time: track.durationMS });

            collector.on('collect', async i => {
                try {
                    if (!i.deferred && !i.replied) {
                        await i.deferUpdate(); // Acknowledge the interaction promptly
                    }

                    const selectedValue = i.values[0];

                    if (selectedValue === 'pause') {
                        await pauseMusic(i);
                    } else if (selectedValue === 'resume') {
                        await resumeMusic(i);
                    } else if (selectedValue === 'stop') {
                        await stopMusic(i);
                        await sentMessage.delete(); // Delete the embed message
                    } else if (selectedValue === 'queue') {
                        await displayQueue(i);
                    } else if (selectedValue === 'lyrics') {
                        await fetchSyncedLyrics(i);
                    } else if (selectedValue === 'skip') {
                        skipSong(i);
                    } else if (selectedValue === 'shuffle') {
                        shuffle(i);
                    } else if (selectedValue === 'repeat') {
                        await repeat(i);
                    } else if (selectedValue === 'autoplay') {
                        await toggleAutoplay(i);
                    }
                } catch (error) {
                    console.error('Error handling select menu interaction:', error);
                    if (!i.replied && !i.deferred) {
                        await i.followUp({ content: 'There was an error handling your request.', ephemeral: true });
                    }
                }
            });

            collector.on('end', async collected => {
                console.log(`Collected ${collected.size} interactions.`);
                try {
                    await sentMessage.delete();
                } catch (error) {
                    console.error('Error deleting the embed message:', error);
                }
            });

        } catch (error) {
            console.error('Error executing playerhandler:', error);
        }
    },
};
