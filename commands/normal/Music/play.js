const { QueryType, useQueue, useMainPlayer } = require('discord-player');
const { EmbedBuilder } = require('discord.js');
const { logo, footer, color } = require('../../../config.json');

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
      } else {
        const track = result.tracks[0];
        queue.addTrack(track);
      }

      if (!queue.node.isPlaying()) {
        queue.node.play();
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
