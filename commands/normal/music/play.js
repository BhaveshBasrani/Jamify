const { QueryType } = require('discord-player');
const { EmbedBuilder } = require('discord.js');
const { banner, logo, footer } = require('../../../config.json');

module.exports = {
  name: 'play',
  description: 'Plays a song or playlist from various sources.',
  aliases: ['pl', 'p'],
  category: 'music',
  async execute(message, args) {
    const query = args.join(' ');
    if (!query) {
      const embed = new EmbedBuilder()
        .setTitle('Error')
        .setDescription('Please provide a song or playlist to play. 🎵')
        .setColor('Red')
        .setAuthor({ name: 'Jamify', iconURL: logo })
        .setFooter({ text: footer });
      return message.reply({ embeds: [embed] });
    }

    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) {
      const embed = new EmbedBuilder()
        .setTitle('Error')
        .setDescription('You need to be in a voice channel to play music! 🔊')
        .setColor('Red')
        .setAuthor({ name: 'Jamify', iconURL: logo })
        .setFooter({ text: footer });
      return message.reply({ embeds: [embed] });
    }

    if (!message.client.player) {
      const embed = new EmbedBuilder()
        .setTitle('Error')
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
          .setTitle('Error')
          .setDescription(`No results found for ${query}! ❌`)
          .setColor('Red')
          .setAuthor({ name: 'Jamify', iconURL: logo })
          .setFooter({ text: footer });
        return message.reply({ embeds: [embed] });
      }

      const queue = message.client.player.nodes.create(message.guild, {
        metadata: {
          channel: message.channel,
        },
        useQueue: true,
      });

      if (!queue.connection) await queue.connect(voiceChannel);

      const track = result.tracks[0];

      if (result.playlist) {
        queue.addTracks(result.tracks);
      } else {
        queue.addTrack(track);
      }
      
      queue.node.play(track);

      if (!queue.isPlaying()) {
        const nowPlayingEmbed = new EmbedBuilder()
          .setTitle('Now Playing')
          .setAuthor({ name: 'Jamify', iconURL: logo })
          .setDescription(`**${track.title || 'Unknown Title'}** by **${track.author || 'Unknown Author'}**`)
          .setColor('Blue')
          .setThumbnail(track.thumbnail || '')
          .setImage(banner)
          .setFooter({ text: footer })
          .addFields(
            { name: 'Duration', value: `${track.duration || 'Unknown Duration'}`, inline: true },
            { name: 'Requested By', value: `@${message.author.tag}`, inline: true }
          );
        message.channel.send({ embeds: [nowPlayingEmbed] });
      } else {
        const embed = new EmbedBuilder()
          .setTitle(result.playlist ? 'Playlist Added to Queue' : 'Track Added to Queue')
          .setAuthor({ name: 'Jamify', iconURL: logo })
          .setDescription(`**${result.playlist ? result.playlist.title : track.title}** has been added to the queue!`)
          .setColor('Blue')
          .setThumbnail(result.playlist ? result.playlist.tracks[0].thumbnail : track.thumbnail)
          .setImage(banner)
          .setFooter({ text: footer })
          .addFields(
            { name: 'Requested By', value: `@${message.author.tag}`, inline: true },
            { name: 'Duration', value: `${result.playlist ? result.playlist.duration : track.duration}`, inline: true }
          );
        message.channel.send({ embeds: [embed] });
      }
    } catch (error) {
      console.error('Error in play command:', error); // Debug log
      const embed = new EmbedBuilder()
        .setTitle('Error')
        .setDescription('An error occurred while trying to play the track. ❌')
        .setColor('Red')
        .setAuthor({ name: 'Jamify', iconURL: logo })
        .setFooter({ text: footer });
      message.reply({ embeds: [embed] });
    }
  },
};