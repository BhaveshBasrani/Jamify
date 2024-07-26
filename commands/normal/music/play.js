const { QueryType } = require('discord-player');
const { EmbedBuilder } = require('discord.js');
const Queue = require('../../../models/queue.js');
const { banner, logo, footer } = require('../../../config.json');

module.exports = {
  name: 'play',
  description: 'Plays a song from Spotify.',
  aliases: ['pl', 'p'],
  category: 'music',
  async execute(message, args) {
    const query = args.join(' ');
    if (!query) return message.reply('Please provide a song to play.');

    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) return message.reply('You need to be in a voice channel to play music!');

    if (!message.client.player) return message.reply('Player is not initialized.');

    let queue = await Queue.findOne({ guildId: message.guild.id });
    if (!queue) {
      queue = new Queue({ guildId: message.guild.id, songs: [] });
      await queue.save();
    }

    try {
      const result = await message.client.player.search(query, {
        requestedBy: message.author,
        searchEngine: QueryType.SPOTIFY_SEARCH,
      });

      if (!result || !result.tracks.length) return message.reply(`No results found for ${query}!`);

      const track = result.tracks[0];
      const song = {
        title: track.title,
        url: track.url,
        author: track.author,
        duration: track.duration,
        requestedBy: message.author.username,
        thumbnail: track.thumbnail,
        channelId: message.channel.id,
        voiceChannelId: voiceChannel.id,
      };

      queue.songs.push(song);
      await queue.save();

      let node = message.client.player.nodes.get(message.guild.id);
      if (!node) {
        node = await message.client.player.nodes.create(message.guild.id, {
          metadata: {
            channel: message.channel,
          },
        });
        await node.connect(voiceChannel);
      }

      const queueEmbed = new EmbedBuilder()
        .setTitle('Added To Queue')
        .setAuthor({ name: 'Jamify', iconURL: logo })
        .setDescription(`>**${track.title}** By **${track.author}**`)
        .setColor('Blue')
        .setThumbnail(track.thumbnail)
        .setImage(banner)
        .setFooter({ text: footer, iconURL: logo })
        .addFields(
          {
            name: '**Requested By**',
            value: `${song.requestedBy}`,
            inline: true,
          },
          {
            name: '**Duration**',
            value: `${track.duration}`,
            inline: true,
          },
          {
            name: '**Position in Queue**',
            value: `${queue.songs.length}`,
            inline: true,
          }
        );

      const liveEmbed = new EmbedBuilder()
        .setTitle('Now Playing')
        .setAuthor({ name: 'Jamify', iconURL: logo })
        .setDescription(`**${track.title}** by **${track.author}**`)
        .setColor('Blue')
        .setThumbnail(track.thumbnail)
        .setImage(banner)
        .setFooter({ text: footer, iconURL: logo })
        .addFields(
          {
            name: '**Duration**',
            value: `${track.duration}`,
            inline: true,
          },
          {
            name: '**Requested By**',
            value: `${song.requestedBy}`,
            inline: true,
          },
          {
            name: '**Position in Queue**',
            value: `${queue.songs.length}`,
            inline: true,
          }
        );

      if (!node.playing) {
        await node.play(track.url);
        message.channel.send({ embeds: [liveEmbed] });
      } else {
        queue.songs.push(song);
        message.channel.send({ embeds: [queueEmbed] });
      }
    } catch (error) {
      console.error(error);
      return message.reply('An error occurred while trying to play the track.');

      Queue.updateOne(
        { guildId: message.guild.id },
        { $set: { currentTrack: song, songs: queue.songs } },
        { upsert: true }
      );
    }

  },
};