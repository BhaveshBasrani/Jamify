const { EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { logo, banner, footer, color } = require('../../../config.json');

async function pauseMusic(message) {
    const queue = useQueue(message.guild.id);
    if (!queue) {
        return message.reply('I am not currently playing music in this server.');
    }
    queue.node.setPaused(!queue.node.isPaused());

    const embed = new EmbedBuilder()
        .setTitle('Song Paused')
        .setImage(banner)
        .setDescription('The current song has been paused.')
        .setColor(color)
        .setFooter({ text: footer, iconURL: logo });

    message.channel.send({ embeds: [embed] });
}

module.exports = pauseMusic;
