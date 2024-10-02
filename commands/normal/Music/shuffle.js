const { useQueue } = require('discord-player');
const { EmbedBuilder } = require('discord.js');
const { logo, footer, color, banner } = require('../../../config.json');


function shuffle(message) {
    const queue = useQueue(message.guild.id);
    if (!queue || !queue.tracks) {
        throw new Error("Invalid queue object");
    }

    queue.tracks.shuffle();

    const embed = new EmbedBuilder()
        .setTitle('Queue Shuffled')
        .setAuthor({ name: 'Jamify', iconURL: logo })
        .setImage(banner)
        .setDescription(`Shuffled by **${message.author}**`)
        .setColor(color)
        .setFooter({ text: footer, iconURL: logo})
        .setTimestamp();

    message.channel.send({ embeds: [embed] });
}

module.exports = shuffle;