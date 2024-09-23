const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const ServerSettings = require('../../../models/ServerSettings.js');
const { banner, logo, footer } = require('../../../config.json');

module.exports = {
    name: 'setprefix',
    description: 'Sets a custom prefix for the server.',
    category: 'Settings',
    aliases: ['prefix', 'changeprefix'],
    async execute(message, args) {
        // Check if the user has administrator permissions
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return message.reply('You do not have permission to use this command.');
        }

        // Get the new prefix from the arguments
        const newPrefix = args[0];
        if (!newPrefix) {
            return message.reply('Please provide a new prefix.');
        }

        // Update the server settings with the new prefix
        await ServerSettings.findOneAndUpdate(
            { guildId: message.guild.id },
            { prefix: { text: newPrefix } },
            { new: true, upsert: true }
        );

        // Create an embed message to confirm the update
        const embed = new EmbedBuilder()
            .setTitle('Prefix Updated')
            .setDescription(`The prefix has been updated to \`${newPrefix}\`.`)
            .setColor('Green')
            .setImage(banner)
            .setFooter({ text: footer, iconURL: logo });

        // Send the embed message to the channel
        message.channel.send({ embeds: [embed] });
    },
};