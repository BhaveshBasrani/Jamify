const { EmbedBuilder } = require('discord.js');
const { banner, logo, footer } = require('../../../config.json');

module.exports = {
    name: 'botinfo',
    description: 'Displays detailed information about the bot.',
    category: 'Settings',
    aliases: ['botinformation', 'botdetails', 'infobot'],
    execute(message) {
        const { client } = message;
        const embed = new EmbedBuilder()
            .setTitle('🤖 Bot Information')
            .setTimestamp()
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
            .addFields(
                { name: '🤖 Bot Name', value: client.user.username, inline: true },
                { name: '#️⃣ Bot Tag', value: `#${client.user.discriminator}`, inline: true },
                { name: '🆔 Bot ID', value: client.user.id, inline: true },
                { name: '🌐 Servers', value: client.guilds.cache.size.toLocaleString(), inline: true },
                { name: '👥 Users', value: client.users.cache.size.toLocaleString(), inline: true },
                { name: '📅 Created On', value: client.user.createdAt.toDateString(), inline: true },
                { name: '💻 Node.js Version', value: process.version, inline: true },
                { name: '🛠 Discord.js Version', value: require('discord.js').version, inline: true }
            )
            .setColor('AQUA')
            .setImage(banner)
            .setFooter({ text: footer, iconURL: logo });

        message.channel.send({ embeds: [embed] });
    },
};
