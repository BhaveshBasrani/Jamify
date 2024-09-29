const { QueryType, useQueue, useMainPlayer } = require('discord-player');
const { EmbedBuilder } = require('discord.js');
const { logo, banner, footer, color } = require('../../../config.json');
const { ClassicPro, Dynamic } = require('musicard');

module.exports = {
  name: 'play',
  description: 'Plays a song or playlist from various sources.',
  aliases: ['pl', 'p'],
  category: 'Music',
  async execute(message, args) {
    const query = args.join(' ');
    const player = useMainPlayer();
    if (!query) {
      const embed = new EmbedBuilder()
        .setTitle('❌ Error')
        .setDescription('Please provide a song or playlist to play. 🎵')
        .setColor(color)
        .setAuthor({ name: 'Jamify', iconURL: logo })
        .setFooter({ text: footer });
      return message.reply({ embeds: [embed] });
    }

    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) {
      const embed = new EmbedBuilder()
        .setTitle('❌ Error')
        .setDescription('You need to be in a voice channel to play music! 🔊')
        .setColor(color)
        .setAuthor({ name: 'Jamify', iconURL: logo })
        .setFooter({ text: footer });
      return message.reply({ embeds: [embed] });
    }

    if (!player) {
      const embed = new EmbedBuilder()
        .setTitle('❌ Error')
        .setDescription('Player is not initialized or ready.')
        .setColor(color)
        .setAuthor({ name: 'Jamify', iconURL: logo })
        .setFooter({ text: footer });
      return message.reply({ embeds: [embed] });
    }

    try {
      const result = await player.search(query, {
        requestedBy: message.author,
        searchEngine: QueryType.SPOTIFY_SEARCH,
      });

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
          await queue.connect(voiceChannel);
        } catch (error) {
          console.error(error);
          return message.reply('Could not join your voice channel! Please make sure I have the necessary permissions.');
        }
      }

      if (result.playlist) {
        queue.addTrack(result.tracks);
        const playlistEmbed = new EmbedBuilder()
          .setTitle('🎶 Playlist Added')
          .setDescription(`**${result.playlist.title}** with **${result.tracks.length}** tracks has been added to the queue.`)
          .setColor(color)
          .setAuthor({ name: 'Jamify', iconURL: logo })
          .setFooter({ text: footer });
        message.reply({ embeds: [playlistEmbed] });
      } else {
        const track = result.tracks[0];
        queue.addTrack(track);

        if (queue.node.isPlaying()) {
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
            .setColor(color)
            .setAuthor({ name: 'Jamify', iconURL: logo })
            .setFooter({ text: footer })
            .setThumbnail('attachment://musicard.png');

          message.reply({
            embeds: [addedToQueueEmbed],
            files: [{ attachment: buffer, name: 'musicard.png' }],
          });
        } else {
          queue.node.play();
        }
      }

    } catch (error) {
      console.error('Error in play command:', error); // Debug log
      const embed = new EmbedBuilder()
        .setTitle('❌ Error')
        .setDescription('An error occurred while trying to play the track.')
        .setColor(color)
        .setAuthor({ name: 'Jamify', iconURL: logo })
        .setFooter({ text: footer });
      message.reply({ embeds: [embed] });
    }
  },
};
