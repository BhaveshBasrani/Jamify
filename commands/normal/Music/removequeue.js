const { EmbedBuilder } = require('discord.js');
const Queue = require('../../../models/queue.js');
const { logo, banner, footer, color } = require('../../../config.json');

module.exports = {
    name: 'removequeue',
    description: 'Removes a song from the queue.',
    category: 'Music',
    aliases: ['rmq', 'rm' , 'rmque' , 'rmqu' ,'rmqueu' ],
    async execute(message, args) {
        const queue = await Queue.findOne({ guildId: message.guild.id });
        const nomusic =  new EmbedBuilder()
            .setTitle('**No Music Playing**')
            .setImage(banner)
            .setDescription('No music is being played!')
            .setColor(color)
            .setFooter({ text: footer, iconURL: logo});
        const validtrack = new EmbedBuilder()
            .setTitle('**Invalid Track Number**')
            .setImage(banner)
            .setDescription('Please provide a valid track number.')
            .setColor(color)
            .setFooter({ text: footer, iconURL: logo});
        if (!queue || !queue.songs.length) {
            return message.reply({ embeds: [nomusic] });
        }

        const index = parseInt(args[0]);
        if (isNaN(index) || index < 1 || index > queue.songs.length) {
            return message.reply({ embeds: [validtrack] });
        }

        const track = queue.songs.splice(index - 1, 1)[0];
        await queue.save();

        const embed = new EmbedBuilder()
            .setTitle('**Song Removed From The Queue**')
            .setImage(banner)
            .setDescription(`${track.title} has been removed from the queue.`)
            .setColor(color)
            .setFooter({ text: footer, iconURL: logo});

        message.channel.send({ embeds: [embed] });
    },
};
