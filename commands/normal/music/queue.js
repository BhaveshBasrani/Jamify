const { EmbedBuilder } = require('discord.js');
const { useQueue } = require("discord-player");
const { logo, banner, footer } = require('../../../config.json');

module.exports = {
    name: 'queue',
    description: 'Displays the current queue.',
    category: 'music',
    async execute(message) {
        try {
            if (!message.guild) {
                return message.reply('This command can only be used in a server!');
            }

            const queue = useQueue(message.guild.id);

            if (!queue) {
                return message.reply('No more songs in the queue!');
            }

            const tracks = queue.tracks.toArray(); 
            const currentTrack = queue.currentTrack;

            if (!currentTrack) {
                return message.reply('No song is currently playing!');
            }

            const tracksString = tracks.map((track, index) => `${index + 1}. ${track.title} - ${track.requestedBy}`).join('\n');

            // Limit the queue string to 2048 characters
            const limitedTracksString = tracksString.substring(0, 2048);

            const embed = new EmbedBuilder()
                .setTitle('Current Queue')
                .setImage(banner)
                .setDescription(`Currently playing: ${currentTrack.title} - ${currentTrack.requestedBy}\n\n${limitedTracksString || 'No more songs in the queue!'}`)
                .setColor('Green')
                .setFooter({ text: footer, iconURL: logo });

            message.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            message.reply('An error occurred while executing the command!');
        }
    },
};