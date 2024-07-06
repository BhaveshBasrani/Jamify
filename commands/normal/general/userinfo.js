const { EmbedBuilder } = require('discord.js');
const { logo, banner, footer } = require('../../../config.json')

module.exports = {
    name: 'userinfo',
    description: 'Displays information about the user.',
    category: 'general',
    async execute(message) {
        const member = message.mentions.members.first() || message.member;
        const embed = new EmbedBuilder()
            .setTitle('User Info')
            .setThumbnail(member.user.displayAvatarURL())
            .addField('Username', member.user.tag)
            .addField('ID', member.user.id)
            .addField('Joined Server', member.joinedAt.toDateString())
            .addField('Account Created', member.user.createdAt.toDateString())
            .setColor('Green')
            .setImage( banner )
            .setFooter({ text: footer, iconURL: logo });
        message.channel.send({ embeds: [embed] });
    },
};
