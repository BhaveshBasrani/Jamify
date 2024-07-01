const { QueryType } = require('discord-player');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'addqueue',
    description: 'Adds a song to the queue.',
    category: 'music',
    async execute(message, args) {
        const query = args.join(' ');
        if (!query) {
            return message.reply('Please provide a song to add to the queue.');
        }

        let queue = message.client.player.nodes.get(message.guild.id);
        if (!queue) {
            queue = await message.client.player.nodes.create(message.guild, {
                metadata: {
                    channel: message.channel
                }
            });
            try {
                await queue.connect(message.member.voice.channel);
            } catch (error) {
                return message.reply('Could not join your voice channel!');
            }
        }

        const result = await message.client.player.search(query, {
            requestedBy: message.author,
            searchEngine: QueryType.AUTO,
        });

        const track = result.tracks[0];
        if (!track) {
            return message.reply(`No results found for ${query}!`);
        }

        queue.addTrack(track);

        const embed = new EmbedBuilder()
            .setTitle('Song Added to Queue')
            .setImage('https://cdn.discordapp.com/attachments/1083025959659245578/1255924342836170782/standard.gif?ex=667ee631&is=667d94b1&hm=df73dbc902c6b853b57e7f324244e272bda2a84c471d7a2e567f698e68326e35&')
            .setDescription(`${track.title} has been added to the queue.`)
            .setColor('Blue')
            .setThumbnail(track.thumbnail)
            .setFooter({ text: '© 2024 Jamify All rights reserved.'});

        message.channel.send({ embeds: [embed] });
    },
};
