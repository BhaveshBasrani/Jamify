const { EmbedBuilder } = require('discord.js');
const Queue = require('../../../models/queue.js');
const { banner, logo, footer } = require('../../../config.json')

module.exports = {
    name: 'removequeue',
    description: 'Removes a song from the queue.',
    category: 'music',
    async execute(message, args) {
        const queue = await Queue.findOne({ guildId: message.guild.id });

        if (!queue || !queue.songs.length) {
            return message.reply('No music is being played!');
        }

        const index = parseInt(args[0]);
        if (isNaN(index) || index < 1 || index > queue.songs.length) {
            return message.reply('Please provide a valid track number.');
        }

        const track = queue.songs.splice(index - 1, 1)[0];
        await queue.save();

        const embed = new EmbedBuilder()
            .setTitle('Song Removed from Queue')
            .setImage(banner)
            .setDescription(`${track.title} has been removed from the queue.`)
            .setColor('Red')
            .setFooter({ text: footer, iconURL: logo});

        message.channel.send({ embeds: [embed] });
    },
};
