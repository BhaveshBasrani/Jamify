const { EmbedBuilder } = require('discord.js');
const { banner, logo, footer } = require('../../../config.json')

module.exports = {
    name: 'botinfo',
    description: 'Displays bot info.',
    category: 'general',
    execute(message) {
        console.log('Executing command: botinfo');
        const { client } = message;
        const embed = new EmbedBuilder()
            .setTitle('Bot Info')
            .setThumbnail(client.user.avatarURL())
            .addFields(
                { name: 'Bot Name', value: client.user.username, inline: true },
                { name: 'Bot Tag', value: client.user.discriminator, inline: true },
                { name: 'Bot ID', value: client.user.id, inline: true },
                { name: 'Servers', value: client.guilds.cache.size.toString(), inline: true },
                { name: 'Users', value: client.users.cache.size.toString(), inline: true },
                { name: 'Created On', value: client.user.createdAt.toDateString(), inline: true }
            )
            .setColor('Aqua')
            .setImage(banner)
            .setFooter({ text: footer , iconURL: logo });
        
        message.channel.send({ embeds: [embed] });
    },
};
