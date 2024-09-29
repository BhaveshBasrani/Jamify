const { EmbedBuilder } = require('discord.js');
const { logo, footer, color } = require('../config.json');
const { ClassicPro } = require('musicard');
module.exports = {
    name: 'playerhandler',
    async execute(queue, track) {
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
            .setColor(color)
            .setImage('attachment://musicard.png')
            .setFooter({ text: footer }) 
            .addFields(
                { name: '⏱ Duration', value: `${track.duration || 'Unknown Duration'}`, inline: true },
                { name: '🙋 Requested By', value: `<@${track.requestedBy.id}>`, inline: true }
            );
            const messageOptions = {
                embeds: [nowPlayingEmbed],
                files: [{ attachment: buffer, name: 'musicard.png' }],
              };

        queue.metadata.channel.send(messageOptions);
    },
};