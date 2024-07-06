const { EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player')
const { logo, footer } = require('../../../config.json')

module.exports = {
    name: 'pause',
    description: 'Pauses the current song.',
    category: 'music',
    async execute(message) {
        const queue = useQueue(message.guild.id);
        if (!queue) {
            return message.reply('I am not currently playing music in this server.');
        }
        queue.node.setPaused(!queue.node.isPaused());

        const embed = new EmbedBuilder()
            .setTitle('Song Paused')
            .setImage('https://cdn.discordapp.com/attachments/1083025959659245578/1255924342836170782/standard.gif?ex=667ee631&is=667d94b1&hm=df73dbc902c6b853b57e7f324244e272bda2a84c471d7a2e567f698e68326e35&')
            .setDescription('The current song has been paused.')
            .setColor('Orange')
            .setFooter({ text: footer, iconURL: logo });

        message.channel.send({ embeds: [embed] });
    },
};
