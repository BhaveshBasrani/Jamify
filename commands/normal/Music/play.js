const { QueryType, useMainPlayer, useQueue, Playlist } = require('discord-player');
const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const { logo, footer, color } = require('../../../config.json');

module.exports = {
    name: 'play',
    description: 'Plays a song. (Only Supports Spotify Links!)',
    category: 'Music',
    aliases: ['p', 'pl'],
    async execute(message, args) {
        const player = useMainPlayer();
        const query = "spotify:" + args.join(' ');

        const voiceChannel = message.member.voice.channel;
        const checks = [
            {
                condition: !voiceChannel,
                message: 'You need to be in a voice channel to play music.',
            },
            {
                condition: !voiceChannel.permissionsFor(message.client.user).has(PermissionsBitField.Flags.Connect),
                message: 'I need the permissions to join your voice channel!',
            },
            {
                condition: !voiceChannel.permissionsFor(message.client.user).has(PermissionsBitField.Flags.Speak),
                message: 'I need the permissions to speak in your voice channel!',
            },
            {
                condition: !query,
                message: 'Please provide a song to play.',
            },
        ];

        for (const check of checks) {
            if (check.condition) {
                const embed = new EmbedBuilder()
                    .setTitle('❌ Error')
                    .setDescription(check.message)
                    .setColor(color)
                    .setAuthor({ name: 'Jamify', iconURL: logo })
                    .setFooter({ text: footer });
                return message.reply({ embeds: [embed] });
            }
        }
        try {
            await player.play(message.member.voice.channel, query);
        } catch (error) {
            console.error('Error in play command:', error);
            const embed = new EmbedBuilder()
            .setTitle('❌ Error')
            .setDescription('An error occurred while trying to play the song.')
            .setColor(color)
            .setAuthor({ name: 'Jamify', iconURL: logo })
            .setFooter({ text: footer });
            return message.reply({ embeds: [embed] });
        }
    }
};
