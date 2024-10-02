const { EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { banner, footer, logo, color } = require('../../../config.json');

async function stopMusic(message) {
    const queue = useQueue(message.guild.id);
    if (!queue) {
        return message.reply('I am not currently playing music in this server.');
    }
    
    queue.node.stop();

    const embed = new EmbedBuilder()
        .setTitle('Music Stopped')
        .setImage(banner)
        .setAuthor({ name: 'Jamify', iconURL: logo })
        .setDescription('The music has been stopped and the queue has been cleared.')
        .setColor(color)
        .setFooter({ text: footer, iconURL: logo });

    message.channel.send({ embeds: [embed] });
}

module.exports = stopMusic;
