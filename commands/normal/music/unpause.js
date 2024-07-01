const { EmbedBuilder } = require('discord.js');
const { useQueue } = require("discord-player");

module.exports = {
    name: 'unpause',
    description: 'Unpauses the current song.',
    category: 'music',
    async execute(message) {
        const queue = useQueue(message.guild.id);

        if (!queue) {
            return message.reply('I am not currently playing music in this server.');
        }

        queue.node.setPaused(!queue.node.isPlaying());

        const embed = new EmbedBuilder()
            .setTitle('Song Unpaused')
            .setImage('https://cdn.discordapp.com/attachments/1083025959659245578/1255924342836170782/standard.gif?ex=667ee631&is=667d94b1&hm=df73dbc902c6b853b57e7f324244e272bda2a84c471d7a2e567f698e68326e35&')
            .setDescription('The current song has been unpaused.')
            .setColor('Green')
            .setFooter({ text: '© 2024 Jamify All rights reserved.'});

        message.channel.send({ embeds: [embed] });
    },
};
