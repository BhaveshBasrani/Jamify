const { QueryType, useQueue } = require('discord-player');
const { EmbedBuilder } = require('discord.js');
const { logo, footer } = require('../../../config.json');
const { ClassicPro, Dynamic } = require('musicard');

module.exports = {
  name: 'play',
  description: 'Plays a song or playlist from various sources.',
  aliases: ['pl', 'p'],
  category: 'music',
  async execute(message, args) {
    const query = args.join(' ');
    if (!query) {
      const embed = new EmbedBuilder()
        .setTitle('❌ Error')
        .setDescription('Please provide a song or playlist to play. 🎵')
        .setColor('Red')
        .setAuthor({ name: 'Jamify', iconURL: logo })
        .setFooter({ text: footer });
      return message.reply({ embeds: [embed] });
    }

    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) {
      const embed = new EmbedBuilder()
        .setTitle('❌ Error')
        .setDescription('You need to be in a voice channel to play music! 🔊')
        .setColor('Red')
        .setAuthor({ name: 'Jamify', iconURL: logo })
        .setFooter({ text: footer });
      return message.reply({ embeds: [embed] });
    }

    if (!message.client.player) {
      const embed = new EmbedBuilder()
        .setTitle('❌ Error')
        .setDescription('Player is not initialized or ready.')
        .setColor('Red')
        .setAuthor({ name: 'Jamify', iconURL: logo })
        .setFooter({ text: footer });
      return message.reply({ embeds: [embed] });
    }

    try {
      const result = await message.client.player.search(query, {
        requestedBy: message.author,
        searchEngine: QueryType.SPOTIFY_SEARCH,
      });

      if (!result || !result.tracks.length) {
        const embed = new EmbedBuilder()
          .setTitle('❌ Error')
          .setDescription(`No results found for ${query}!`)
          .setColor('Red')
          .setAuthor({ name: 'Jamify', iconURL: logo })
          .setFooter({ text: footer });
        return message.reply({ embeds: [embed] });
      }

      let queue = useQueue(message.guild.id);

      if (!queue) {
        try {
            queue = message.client.player.nodes.create(message.guild, {
                metadata: {
                    channel: message.channel
                }
            });
            await queue.connect(voiceChannel);
        } catch (error) {
            console.error(error);
            return message.reply('Could not join your voice channel! Please make sure I have the necessary permissions.');
        }
    }

      const track = result.tracks[0];

      if (result.playlist) {
        queue.addTracks(result.tracks);
      } else {
        queue.addTrack(track);
      }

      if (queue.node.isPlaying()) {
        (async () => {
          const musicard = await Dynamic({
            thumbnailImage: track.thumbnail || '',
            backgroundColor: '#070707',
            progress: 0,
            progressColor: '#FF7A00',
            progressBarColor: '#5F2D00',
            name: track.title || 'Unknown Title',
            nameColor: '#FF7A00',
            author: track.author || 'Unknown Author',
            authorColor: '#696969',
          });

          const buffer = Buffer.from(musicard);

          const addedToQueueEmbed = new EmbedBuilder()
            .setTitle('Added to Queue')
            .setDescription(`**${track.title || 'Unknown Title'}** by **${track.author || 'Unknown Author'}** has been added to the queue.`)
            .setColor('Green')
            .setAuthor({ name: 'Jamify', iconURL: logo })
            .setFooter({ text: footer })
            .setThumbnail('attachment://musicard.png');

          message.reply({
            embeds: [addedToQueueEmbed],
            files: [{ attachment: buffer, name: 'musicard.png' }],
          });
        })();
      } else {
        queue.node.play(track);

        const updateCard = async () => {
          const musicard = await ClassicPro({
            thumbnailImage: track.thumbnail || '',
            backgroundColor: '#070707',
            progress: track.duration || '',
            progressColor: '#FF7A00',
            progressBarColor: '#5F2D00',
            name: track.title || 'Unknown Title',
            nameColor: '#FF7A00',
            author: track.author || 'Unknown Author',
            authorColor: '#696969',
            startTime: '0:00',
            endTime: track.duration || 'Unknown Duration',
            timeColor: '#FF7A00',
          });

          const buffer = Buffer.from(musicard);

          const nowPlayingEmbed = new EmbedBuilder()
            .setTitle('🎶 Now Playing')
            .setAuthor({ name: 'Jamify', iconURL: logo })
            .setDescription(`**${track.title || 'Unknown Title'}** by **${track.author || 'Unknown Author'}**`)
            .setColor('Blue')
            .setImage('attachment://musicard.png')
            .setFooter({ text: footer })
            .addFields(
              { name: '⏱ Duration', value: `${track.duration || 'Unknown Duration'}`, inline: true },
              { name: '🙋 Requested By', value: `${message.author}`, inline: true }
            );

          const messageOptions = {
            embeds: [nowPlayingEmbed],
            files: [{ attachment: buffer, name: 'musicard.png' }],
          };

          message.channel.send(messageOptions);
        };

        updateCard();
      }

    } catch (error) {
      console.error('Error in play command:', error); // Debug log
      const embed = new EmbedBuilder()
        .setTitle('❌ Error')
        .setDescription('An error occurred while trying to play the track.')
        .setColor('Red')
        .setAuthor({ name: 'Jamify', iconURL: logo })
        .setFooter({ text: footer });
      message.reply({ embeds: [embed] });
    }
  },
};