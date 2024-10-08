const { EmbedBuilder } = require('discord.js');
const { logo, footer, color } = require('../../../config.json');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Shows a user\'s avatar.')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('The user to show the avatar of')
                .setRequired(false)),
    async execute(interaction) {
        try {
            const user = interaction.options.getUser('user') || interaction.user;
            const avatarURL = user.avatarURL({ dynamic: true, size: 512 });

            if (!avatarURL) {
                return interaction.reply('User does not have an avatar.');
            }

            const embed = new EmbedBuilder()
                .setTitle(`${user.username.displayName}'s Avatar`)
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