const { EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player')
const Queue = require('../../../models/queue.js')
const { banner, footer, logo } = require('../../../config.json')

module.exports = {
    name: 'stop',
    description: 'Stops the current song and clears the queue.',
    category: 'music',
    aliases: ['sto', 'st' , 's'],
    async execute(message) {
        const queue = useQueue(message.guild.id);
        if (!queue) {
            return message.reply('I am not currently playing music in this server.');
        }
        queue.delete();
        await Queue.deleteOne({ guildId: message.guild.id });

        const embed = new EmbedBuilder()
            .setTitle('Music Stopped')
            .setImage(banner)
            .setAuthor({name: 'Jamify', iconURL:logo})
            .setDescription('The music has been stopped and the queue has been cleared.')
            .setColor('Red')
            .setFooter({ text: footer , iconURL: logo});

        message.channel.send({ embeds: [embed] });
    },
};
