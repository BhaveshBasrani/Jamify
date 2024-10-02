const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
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

            const controlButtons = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('pause')
                        .setLabel('Pause')
                        .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                        .setCustomId('stop')
                        .setLabel('Stop')
                        .setStyle(ButtonStyle.Danger),
                    new ButtonBuilder()
                        .setCustomId('skip')
                        .setLabel('Skip')
                        .setStyle(ButtonStyle.Secondary)
                );

            const queueButtons = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('queue')
                        .setLabel('Queue')
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setCustomId('lyrics')
                        .setLabel('Lyrics')
                        .setStyle(ButtonStyle.Secondary)
                );

            const extraButtons = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('shuffle')
                        .setLabel('Shuffle')
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setCustomId('repeat')
                        .setLabel('Repeat')
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setCustomId('autoplay')
                        .setLabel('Autoplay')
                        .setStyle(ButtonStyle.Secondary)
                );

            const messageOptions = {
                embeds: [nowPlayingEmbed],
                files: [{ attachment: buffer, name: 'spotify.png' }],
                components: [controlButtons, queueButtons, extraButtons]
            };

            const sentMessage = await queue.metadata.channel.send(messageOptions);

            let isPaused = false;

            const filter = i => i.user.id === track.requestedBy.id;
            const collector = sentMessage.createMessageComponentCollector({ filter, time: track.durationMS });

            collector.on('collect', async i => {
                try {
                    await i.deferUpdate(); // Acknowledge the interaction promptly
            
                    if (i.customId === 'pause') {
                        if (isPaused) {
                            await resumeMusic(i);
                            const button = i.message.components[0].components.find(btn => btn.customId === 'pause');
                            button.setLabel('Pause');
                            controlButtons.components.forEach(button => button.setDisabled(false));
                            queueButtons.components.forEach(button => button.setDisabled(false));
                            extraButtons.components.forEach(button => button.setDisabled(false));
                        } else {
                            await pauseMusic(i);
                            const button = i.message.components[0].components.find(btn => btn.customId === 'pause');
                            button.setLabel('Resume');
                            i.component.setLabel('Resume');
                            controlButtons.components.forEach(button => button.setDisabled(true));
                            queueButtons.components.forEach(button => button.setDisabled(true));
                            extraButtons.components.forEach(button => button.setDisabled(true));
                        }
                        isPaused = !isPaused;
                    } else if (i.customId === 'stop') {
                        await stopMusic(i);
                        await sentMessage.delete(); // Delete the embed message
                    } else if (i.customId === 'queue') {
                        await displayQueue(i);
                    } else if (i.customId === 'lyrics') {
                        await fetchSyncedLyrics(i);
                    } else if (i.customId === 'skip') {
                        skipSong(i);
                    } else if (i.customId === 'shuffle') {
                        shuffle(i);
                    } else if (i.customId === 'repeat') {
                        await repeat(i);
                    } else if (i.customId === 'autoplay') {
                        await toggleAutoplay(i);
                    }
                    // Only update the message if the interaction has not been replied to
                    if (!i.replied && !i.deferred) {
                        await i.update({ components: [controlButtons, queueButtons, extraButtons] });
                    }
                } catch (error) {
                    console.error('Error handling button interaction:', error);
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