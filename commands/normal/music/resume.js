const { EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { banner, logo, footer } = require('../../../config.json')

module.exports = {
    name: 'resume',
    description: 'Resumes the current song.',
    category: 'music',
    async execute(message) {
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
           .setColor('Green')
           .setFooter({ text: footer, logo});

        message.channel.send({ embeds: [embed] });
    },
};
