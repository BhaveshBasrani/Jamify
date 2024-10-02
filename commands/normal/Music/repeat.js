const { useQueue, QueueRepeatMode } = require('discord-player');
const { EmbedBuilder } = require('discord.js');
const { logo, footer, color, banner } = require('../../../config.json');

function repeat(message) {
    const queue = useQueue(message.guild.id);
    if (!queue || !queue.current) {
        return message.channel.send("There is no song currently playing.");
    }

    const track = queue.current;

    queue.setRepeatMode(QueueRepeatMode.TRACK); 

    const embed = new EmbedBuilder()
        .setTitle('Repeating Song')
        .setAuthor({ name: 'Jamify', iconURL: logo })
        .setImage(banner)
        .setDescription(`Repeating **${track.title}** requested by **${message.author}**`)
        .setColor(color)
        .setFooter({ text: footer, iconURL: logo})
        .setTimestamp();

    message.channel.send({ embeds: [embed] });
}

module.exports = repeat;