const { EmbedBuilder } = require('discord.js');
const { logo, banner, footer } = require('../../../config.json')

module.exports = {
    name: 'serverinfo',
    description: 'Displays server information.',
    category: 'general',
    execute(message) {
        console.log('Executing command: serverinfo');
        const { guild } = message;
        const embed = new EmbedBuilder()
            .setTitle(guild.name)
            .setThumbnail(guild.iconURL())
            .addFields(
                { name: 'Members', value: guild.memberCount.toString(), inline: true },
                { name: 'Owner', value: `<@${guild.ownerId}>`, inline: true },
                { name: 'Created On', value: guild.createdAt.toDateString(), inline: true }
            )
            .setColor('#00AAFF')
            .setImage( banner )
            .setFooter({ text: footer, iconURL: logo });
        message.channel.send({ embeds: [embed] });
    },
};
