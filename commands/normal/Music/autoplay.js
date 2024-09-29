const { EmbedBuilder } = require('discord.js');
const { useQueue, QueueRepeatMode } = require('discord-player');
const { logo, banner, footer, color } = require('../../../config.json');
const Queue = require('../../../models/queue'); 

module.exports = {
    name: 'autoplay',
    description: 'Enables or disables AutoPlay for the queue.',
    category: 'Music',
    aliases: ['autoplay', 'ap'],
    async execute(message, args) {
        const queue = useQueue(message.guild.id);
        if (!queue || !queue.isPlaying()) {
            return message.reply('No music is currently being played!');
        }

        // Toggle autoplay mode
        const autoplayEnabled = queue.repeatMode !== QueueRepeatMode.AUTOPLAY;
        queue.setRepeatMode(autoplayEnabled ? QueueRepeatMode.AUTOPLAY : QueueRepeatMode.OFF);

        // Save the autoplay status in the database
        await Queue.findOneAndUpdate(
            { guildId: message.guild.id },
            { autoplay: autoplayEnabled },
            { upsert: true }
        );

        const description = autoplayEnabled ? 'AutoPlay has been enabled.' : 'AutoPlay has been disabled.';

        const embed = new EmbedBuilder()
            .setTitle('AutoPlay Toggled')
            .setImage(banner)
            .setDescription(description)
            .setColor(color)
            .setFooter({ text: footer, iconURL: logo });

        message.channel.send({ embeds: [embed] });
    },
};