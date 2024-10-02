const { EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { logo, banner, footer, color } = require('../../../config.json');

async function resumeMusic(message) {
    const queue = useQueue(message.guild.id);
    if (!queue) {
        return message.reply('I am not currently playing music in this server.');
    }
    if (!queue.node.isPaused()) {
        return message.reply('The song is already playing.');
    }

    queue.node.setPaused(false);

    const embed = new EmbedBuilder()
       .setTitle('Song Resumed')
       .setImage(banner)
       .setDescription('The current song has been resumed.')
       .setColor(color)
       .setFooter({ text: footer, logo });

    message.channel.send({ embeds: [embed] });
}

module.exports = resumeMusic;
