const { EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { logo, banner, footer, color } = require('../../../config.json');

module.exports = {
    name: 'volume',
    description: 'Adjusts the volume of the music.',
    category: 'Music',
    aliases: ['vol', 'v'],
    args: [
        {
            key: 'volume',
            prompt: 'What volume would you like to set? (0-100)',
            type: 'integer',
            validate: volume => volume >= 0 && volume <= 100
        }
    ],
    async execute(message, args) {
        const volume = parseInt(args[0], 10);
        if (isNaN(volume) || volume < 0 || volume > 100) {
            const embed = new EmbedBuilder()
            .setTitle('Invalid Volume')
            .setAuthor({ name: 'Jamify', iconURL: logo })
            .setImage(banner)
            .setDescription('Please provide a valid volume between 0 and 100.')
            .setColor(color)
            .setFooter({ text: footer, iconURL: logo });

            return message.reply({ embeds: [embed] });
        }

        const queue = useQueue(message.guild.id);
        if (!queue || !queue.currentTrack) {
            const embed = new EmbedBuilder()
            .setTitle('No Song Playing')
            .setAuthor({ name: 'Jamify', iconURL: logo })
            .setImage(banner)
            .setDescription('No song is currently playing!')
            .setColor(color)
            .setFooter({ text: footer, iconURL: logo });

            return message.reply({ embeds: [embed] });
        }

        queue.node.setVolume(volume / 100);

        const embed = new EmbedBuilder()
            .setTitle('Volume Adjusted')
            .setAuthor({ name: 'Jamify', iconURL: logo })
            .setImage(banner)
            .setDescription(`Volume set to **${volume}%**`)
            .setColor(color)
            .setFooter({ text: footer, iconURL: logo });

        message.reply({ embeds: [embed] });
    },
};