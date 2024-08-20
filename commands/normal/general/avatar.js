const { EmbedBuilder } = require('discord.js')
const { logo, footer } = require('../../../config.json')

module.exports = {
    name: 'avatar',
    description: 'Shows a user\'s avatar.',
    category: 'general',
    aliases: ['a','av','avt'],
    execute(message, args) {
        console.log('Executing command: avatar');
        const user = message.mentions.users.first() || message.author;
        const embed = new EmbedBuilder()

        .setTitle(`${user}'s Avatar`)
        .setImage(user.avatarURL({ dynamic: true, size: 512 }))
        .setColor('Red')
        .setFooter({ text: footer , iconURL: logo });

        message.channel.send({ embeds: [embed] });
    },
};
