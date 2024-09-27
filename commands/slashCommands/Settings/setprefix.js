const { EmbedBuilder, PermissionsBitField, SlashCommandBuilder } = require('discord.js');
const ServerSettings = require('../../../models/ServerSettings.js');
const { logo, banner, footer, color } = require('../../../config.json');

module.exports = {
    data: new SlashCommandBuilder() 
    .setName('setprefix')
    .setDescription('Sets a custom prefix for the server.'),
    async execute(interaction) {
        // Check if the user has administrator permissions
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply('You do not have permission to use this command.');
        }

        // Get the new prefix from the arguments
        const newPrefix = interaction.options.getString('prefix');
        if (!newPrefix) {
            return interaction.reply('Please provide a new prefix.');
        }

        // Update the server settings with the new prefix
        await ServerSettings.findOneAndUpdate(
            { guildId: interaction.guild.id },
            { prefix: { text: newPrefix } },
            { new: true, upsert: true }
        );

        // Create an embed message to confirm the update
        const embed = new EmbedBuilder()
            .setTitle('Prefix Updated')
            .setDescription(`The prefix has been updated to \`${newPrefix}\`.`)
            .setColor(color)
            .setImage(banner)
            .setFooter({ text: footer, iconURL: logo });

        // Send the embed message to the channel
        await interaction.reply({ embeds: [embed] });
    },
};