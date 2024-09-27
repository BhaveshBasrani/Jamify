const { EmbedBuilder } = require('discord.js');
const { logo, banner, footer, color } = require('../../../config.json');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('botinfo')
        .setDescription('Displays detailed information about the bot.'),
    async execute(interaction) {
        const { client } = interaction;
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
            .setColor(color)
            .setImage(banner)
            .setFooter({ text: footer, iconURL: logo });

        await interaction.reply({ embeds: [embed] });
    },
};