const { EmbedBuilder } = require('discord.js');
const { logo, footer, color } = require('../../../config.json');

module.exports = {
    name: 'avatar',
    description: 'Shows a user\'s avatar.',
    async execute(interaction) {
        try {
            const user = interaction.options.getUser('user') || interaction.user;
            const avatarURL = user.avatarURL({ dynamic: true, size: 512 });

            if (!avatarURL) {
                return interaction.reply('User does not have an avatar.');
            }

            const embed = new EmbedBuilder()
                .setTitle(`${user.username}'s Avatar`)
                .setDescription(`[Avatar URL](${avatarURL})`)
                .setImage(avatarURL)
                .setColor(color)
                .setFooter({ text: footer, iconURL: logo })
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Error executing avatar command:', error);
            interaction.reply('An error occurred while executing the command.');
        }
    },
};